import firebase from 'app/firebase';
import axios from 'axios';
const crypto = require('crypto');

import * as rConst from "reduxConstants";

export const startAddUser = (email, password) =>{
  return (dispatch, getState) => {
    const cleanEmail                    = email.trim().toLowerCase()
    var newUser                         = {}
    var profile                         = {}
    return firebase.auth().createUserWithEmailAndPassword(cleanEmail, password).then(user => {
      newUser                           = user.user
      if(user.additionalUserInfo.isNewUser){
        return getUserGravatar(cleanEmail)
      }
    }).then(function (res) {
      if (res.success){
        profile.displayName             = res.entry[0].name.formatted
        profile.photoURL                = res.entry[0].thumbnailUrl
      } else {
        profile.displayName             = "君の名は？"
        profile.photoURL                = `https://www.gravatar.com/avatar/${res.hash}`
      }
      return newUser.updateProfile({...profile})
    }).then(() =>{
      dispatch(login({
        name                            : profile.displayName,
        profilePic                      : profile.photoURL,
      }))
      return {success: true}
    }).catch(e =>{
      console.log('Unable to signup', e);
      return {success: false, ...e};
    })
  }
}

export const startLoginUser = (email, password) =>{
  const cleanEmail                    = email.trim().toLowerCase()

  return firebase.auth().signInWithEmailAndPassword(cleanEmail, password).catch(e =>{
    console.log('Unable to login', e);
    return { success: false, ...e };
  })
}

export const getUserGravatar = (email) =>{
  const hash                          = crypto.createHash('md5').update(email).digest("hex")
  
  return axios.get(`https://en.gravatar.com/${hash}.json`)
    .then(function (res) {
      return {success: true, ...res.data};
    }).catch(function (error) {
      console.log("getUserGravatar", error);
      return { success: false, hash, message: error }
    })
}

export const startLogoutUser = () =>{
  return firebase.auth().signOut().then( () =>{
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