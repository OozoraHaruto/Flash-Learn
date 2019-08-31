import React from 'react';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

try {
  const config = {
    apiKey                : process.env.FIREBASE_API_KEY,
    authDomain            : process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL           : process.env.FIREBASE_DATABASE_URL,
    projectId             : process.env.FIREBASE_PROJECT_ID,
    storageBucket         : "",
    messagingSenderId     : process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId                 : process.env.FIREBASE_APP_ID
  };
  firebase.initializeApp(config);
} catch (e) {

}

export var database     = firebase.firestore()
export var auth         = firebase.auth()
export default firebase;