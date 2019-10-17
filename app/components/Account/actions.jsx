import axios from 'axios';
const crypto = require('crypto');

import firebase, { auth, database } from 'firebase';
import * as dbConst from 'databaseConstants'
import * as rConst from "reduxConstants";

// Auth
export const startAddUser = (email, password) =>{
  const cleanEmail                      = email.trim().toLowerCase()
  const hash                            = crypto.createHash('md5').update(cleanEmail).digest("hex")
  var newUser                           = {}
  var profile                           = {}
  return auth.createUserWithEmailAndPassword(cleanEmail, password).then(user => {
    newUser                             = user.user
    
    if(user.additionalUserInfo.isNewUser){
      return getUserGravatar(hash)
    }
  }).then(function (res) {
    profile.displayName                 = res.success ? res.entry[0].name.formatted : "君の名は？"
    profile.photoURL                    = `https://secure.gravatar.com/avatar/${hash}`
    profile.username                    = res.success ? res.entry[0].preferredUsername : newUser.uid
    var actions                         = [
      newUser.updateProfile(profile),
      writeToUserProfileDatabase(newUser.uid, profile),
      sendVerificationEmail()
    ]
    return Promise.all(actions)
  }).then(res => {
    return { success: true }
  }).catch(e =>{
    console.log('Unable to signup', e);
    return {success: false, ...e};
  })
}

export const getUserGravatar = hash =>{
  return axios.get(`https://en.gravatar.com/${hash}.json`).then(function (res) {
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

export const startReAuthentication = (email, password) =>{
  return auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(email, password)).then(() =>{
    return {success: true}
  }).catch(e => {
    console.log('startReAuthentication', e);
    return { success: false, ...e };
  })
}

export const startEditUserName = displayName =>{
  const user                            = auth.currentUser
  return user.updateProfile({displayName}).then(() =>{
    return database.collection(dbConst.COL_USER).doc(user.uid).set({ displayName }, { merge: true })
  }).then(() => {
    return { success: true }
  }).catch(e => {
    console.log('startEditUserName', e);
    return { success: false, ...e };
  })
}

export const startEditUserEmail = email =>{
  return auth.currentUser.updateEmail(email).then(() => {
    return { success: true }
  }).catch(e => {
    console.log('startEditUserName', e);
    return { success: false, ...e };
  })
}

export const startEditUserPassword = password =>{
  return auth.currentUser.updatePassword(password).then(() => {
    return { success: true }
  }).catch(e => {
    console.log('startEditUserName', e);
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

export const getSubscribedDecks = (userId, limit = 0) =>{
  var subscribedDeck                    = database.collection(dbConst.COL_USER).doc(userId).collection(dbConst.PROFILE_SUBSCRIBED_DECKS).orderBy('createdOn', 'desc')

  if(limit != 0){
    subscribedDeck.limit(limit)
  }

  return subscribedDeck.get().then(snapshot => {
    return { success: true, data: snapshot.docs }
  }).catch(e => {
    console.log("getSubscribedDecks", e)
    return { success: false, ...e };
  })
}

export const getCreatedDecks = (userId, limit = 0) =>{
  var createdDeck                       = database.collection(dbConst.COL_USER).doc(userId).collection(dbConst.PROFILE_CREATED_DECKS).orderBy('modified', 'desc')

  if(limit != 0){
    createdDeck.limit(limit)
  }

  return createdDeck.get().then(snapshot => {
    return { success: true, data: snapshot.docs }
  }).catch(e => {
    console.log("getCreatedDecks", e)
    return { success: false, ...e };
  })
}

export const addProfileToRedux = profile =>{
  return{
    type: rConst.ADD_CURRENT_PROFILE,
    profile
  }
}

export const deleteReduxProfile = () => {
  return {
    type: rConst.DELETE_CURRENT_PROFILE
  }
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

export const startAddSubscribedDeckRef = (deckId, name, owner) => {
  return database.collection(dbConst.COL_USER).doc(auth.currentUser.uid).collection(dbConst.PROFILE_SUBSCRIBED_DECKS).doc(deckId).set({
    createdOn                           : firebase.firestore.FieldValue.serverTimestamp(),
    name,
    owner                               : database.doc(`/${dbConst.COL_USER}/${owner}`),
  }).then(ref => {
    var actions = []
    actions.push(database.collection(dbConst.COL_DECKSUBCRIPTION).doc(deckId).update('count', firebase.firestore.FieldValue.increment(1)))
    actions.push(database.collection(dbConst.COL_DECKSUBCRIPTION).doc(deckId).collection(dbConst.COL_DECKSUBCRIPTION_FOLLOWERS).doc(auth.currentUser.uid).set({ modified: firebase.firestore.FieldValue.serverTimestamp()}))
    return Promise.all(actions)
  }).then(() =>{
    return { success: true }
  }).catch(e => {
    console.log("startAddSubscribedDeckRef", e)
    return { success: false, ...e };
  })
}

export const startDeleteSubscribedDeckRef = deckId => {
  return database.collection(dbConst.COL_USER).doc(auth.currentUser.uid).collection(dbConst.PROFILE_SUBSCRIBED_DECKS).doc(deckId).delete().then(ref => {
    var actions = []
    actions.push(database.collection(dbConst.COL_DECKSUBCRIPTION).doc(deckId).update('count', firebase.firestore.FieldValue.increment(-1)))
    actions.push(database.collection(dbConst.COL_DECKSUBCRIPTION).doc(deckId).collection(dbConst.COL_DECKSUBCRIPTION_FOLLOWERS).doc(auth.currentUser.uid).delete())
    return Promise.all(actions)
  }).then(() =>{
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



// Leaderboard Related
export const getFastestUserTiming = (testType, deckId) =>{
  return database.collection(dbConst.COL_LEADERBOARD).doc(testType).collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.COL_USER).orderBy('timeMillis').limit(1).get().then(snapshot => {
    return { success: true, data: snapshot.docs.length == 0 ? false : snapshot.docs[0].timeMillis }
  }).catch(e => {
    console.log("getFastestUserTiming", e)
    return { success: false, ...e };
  })
}

export const getUserFastestTiming = (testType, deckId) =>{
  return database.collection(dbConst.COL_LEADERBOARD).doc(testType).collection(dbConst.COL_DECKS).doc(deckId).collection(dbConst.COL_USER).doc(auth.currentUser.uid).get().then(doc => {
    return { success: true, data: doc.exists ? doc.data().timeMillis : false }
  }).catch(e => {
    console.log("getFastestUserTiming", e)
    return { success: false, ...e };
  })
}

export const getUserPointLeaderboard = userId =>{

}

const checkIfCurrentUserPointLeaderboardExist = () =>{
  return database.collection(dbConst.COL_LEADERBOARD).doc(dbConst.LEADERBOARD_POINT).collection(dbConst.COL_USER).doc(auth.currentUser.uid).get().then(doc => {
    return doc.exists
  }).catch(e => {
    console.log("getFastestUserTiming", e)
    return false
  })
}

export const addPointToLeaderboard = point =>{
  return checkIfCurrentUserPointLeaderboardExist().then(userExists =>{
    if(userExists){
      return database.collection(dbConst.COL_LEADERBOARD).doc(dbConst.LEADERBOARD_POINT).collection(dbConst.COL_USER).doc(auth.currentUser.uid).update('point', firebase.firestore.FieldValue.increment(point))
    }else{
      return database.collection(dbConst.COL_LEADERBOARD).doc(dbConst.LEADERBOARD_POINT).collection(dbConst.COL_USER).doc(auth.currentUser.uid).set({
        point,
        user                                : database.doc(`/${dbConst.COL_USER}/${auth.currentUser.uid}`),
      })
    }
  }).then(() =>{
    return { success: true }
  }).catch(e => {
    console.log("addPointToLeaderboard", e)
    return { success: false, ...e };
  })
}