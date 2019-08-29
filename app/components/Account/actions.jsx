import firebase from 'app/firebase';
import axios from 'axios';
const crypto = require('crypto');

import * as rConst from "reduxConstants";

export const startAddUser = (email, password) =>{
  const cleanEmail                    = email.trim().toLowerCase()
  var newUser                         = {}
  return firebase.auth().createUserWithEmailAndPassword(cleanEmail, password).then(user => {
    newUser                           = user.user
    if(user.additionalUserInfo.isNewUser){
      const hash                      = crypto.createHash('md5').update(email).digest("hex")
      return getUserGravatar(hash)
    }
  }).then(function (res) {
    console.log(newUser)
    var profile = {}
    if (res.success){
      profile.displayName             = res.entry[0].name.formatted
      profile.photoURL                = res.entry[0].thumbnailUrl
    } else {
      profile.displayName             = "君の名は？"
      profile.photoURL                = "https://www.gravatar.com/avatar/00000000000000000000000000000000"
    }
    return newUser.updateProfile({...profile})
  }).then(res =>{
    return {success: true, ...res}
  }).catch(e =>{
    console.log('Unable to signup', e);
    return {success: false, ...e};
  })
}

export const startLoginUser = (email, password) =>{
  const cleanEmail                    = email.trim().toLowerCase()

  return firebase.auth().signInWithEmailAndPassword(cleanEmail, password).catch(e =>{
    console.log('Unable to login', e);
    return { success: false, ...e };
  })
}

export const getUserGravatar = (email, hashed=true) =>{
  const hash                          = hashed ? email : crypto.createHash('md5').update(email).digest("hex")
  
  return axios.get(`https://en.gravatar.com/${hash}.json`)
    .then(function (res) {
      return {success: true, ...res.data};
    }).catch(function (error) {
      console.log("getUserGravatar", error);
      return { success: false, message: error }
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