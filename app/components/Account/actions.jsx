import axios from 'axios';
const crypto = require('crypto');

import firebase, { auth, database } from 'firebase';
import * as dbConst from 'databaseConstants'
import * as rConst from "reduxConstants";

// Auth
export const startAddUser = (email, password) =>{
  return (dispatch, getState) => {
    const cleanEmail                    = email.trim().toLowerCase()
    var newUser                         = {}
    var profile                         = {}
    return auth.createUserWithEmailAndPassword(cleanEmail, password).then(user => {
      newUser                           = user.user
      if(user.additionalUserInfo.isNewUser){
        return getUserGravatar(cleanEmail)
      }
    }).then(function (res) {
      if (res.success){
        profile.displayName             = res.entry[0].name.formatted
        profile.photoURL                = `https://secure.gravatar.com/avatar/${res.entry[0].hash}`
        profile.username                = res.entry[0].preferredUsername
      } else {
        profile.displayName             = "君の名は？"
        profile.photoURL                = `https://secure.gravatar.com/avatar/${res.hash}`
        profile.username                = newUser.uid
      }
      var actions                       = [
        newUser.updateProfile(profile),
        writeToUserProfileDatabase(newUser.uid, profile),
        sendVerificationEmail()
      ]
      dispatch(login({
        id                              : newUser.uid,
        name                            : profile.displayName,
        profilePic                      : profile.photoURL,
      }))

      return Promise.all(actions)
    }).then(res => {
      return { success: true }
    }).catch(e =>{
      console.log('Unable to signup', e);
      return {success: false, ...e};
    })
  }
}

const getUserGravatar = (email) =>{
  const hash                            = crypto.createHash('md5').update(email).digest("hex")
  
  return axios.get(`https://en.gravatar.com/${hash}.json`)
    .then(function (res) {
      return {success: true, ...res.data};
    }).catch(function (error) {
      console.log("getUserGravatar", error);
      return { success: false, hash, message: error }
    })
}

const writeToUserProfileDatabase = (id, data) =>{
  return database.collection(dbConst.COL_USER).doc(id).set(data)
}

export const sendVerificationEmail = () =>{
  return auth.currentUser.sendEmailVerification().then(() =>{
    return true
  }).catch(e =>{
    console.log("sendVerificationEmail", e);
    return false
  })
}

export const startLoginUser = (email, password) => {
  const cleanEmail = email.trim().toLowerCase()
  console.log(cleanEmail)

  return auth.signInWithEmailAndPassword(cleanEmail, password).then(()=>{
    return {success: true}
  }).catch(e => {
    console.log('Unable to login', e);
    return { success: false, ...e };
  })
}

export const startLogoutUser = () =>{
  return auth.signOut().then( () =>{
    return { success: true };
  }).catch(e =>{
    console.log("startLogoutUser", error);
    return { success: false, ...e };
  })
}

export const login = (session) =>{
  return {
    type: rConst.ADD_SESSION,
    session
  }
}

export const logout = () => {
  return {
    type: rConst.DELETE_SESSION
  }
}


// Profile
export const getUserProfile = id =>{
  return database.collection(dbConst.COL_USER).doc(id).get().then(doc =>{
    if(!doc.exists){
      console.log("getUserProfile", "no such file")
      return {success: false, message: "No such file"}
    }else{
      return {success: true, data: doc.data()}
    }
  }).catch(e =>{
    console.log("getUserProfile", e)
    return { success: false, ...e };
  })
}

export const getAchievements = () =>{
  return database.collection(dbConst.COL_ACHIEVEMENTS).get().then(snapshot =>{
    return {success: true, data: snapshot}
  }).catch(e => {
    console.log("getAchievements", e)
    return { success: false, ...e };
  })
}


// Decks Related
export const startAddOrEditCreatedDeckRef = (userId, deckId, deckDetails) => {
  return database.collection(dbConst.COL_USER).doc(userId).collection(dbConst.PROFILE_CREATED_DECKS).doc(deckId).set({
    modified: firebase.firestore.FieldValue.serverTimestamp(), 
    ...deckDetails
  }, { merge: true }).then(ref => {
    return { success: true }
  }).catch(e => {
    console.log("startAddOrEditCreatedDeckRef", e)
    return { success: false, ...e };
  })
}

export const startAddSubscribedDeckRef = deckId => {
  return database.collection(dbConst.COL_USER).doc(auth.currentUser.uid).collection(dbConst.PROFILE_SUBSCRIBED_DECKS).doc(deckId).set({
    createdOn: firebase.firestore.FieldValue.serverTimestamp()
  }).then(ref => {
    return { success: true }
  }).catch(e => {
    console.log("startAddSubscribedDeckRef", e)
    return { success: false, ...e };
  })
}

export const checkIfUserIsSubscribedToDeck = deckId => {
  return database.collection(dbConst.COL_USER).doc(auth.currentUser.uid).collection(dbConst.PROFILE_SUBSCRIBED_DECKS).doc(deckId).get().then(doc => {
    return { success: true, data: doc }
  }).catch(e => {
    console.log("checkIfUserIsSubscribedToDeck", e)
    return { success: false, ...e };
  })
}