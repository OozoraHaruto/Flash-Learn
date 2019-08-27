import firebase from 'firebase/app'

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
// export var emailProvider  = new firebase.auth.EmailAuthProvider();
// export var firebaseRef    = firebase.database().ref();
export default firebase;