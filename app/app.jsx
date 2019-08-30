//Modules
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

// Personal Modules
import Router from 'app/router/';
import firebase from 'app/firebase';
import { accounts } from 'actions'

//App CSS
require('applicationStyles');

//App JS
require('myJS/all.jsx');

// For react-redux
import {configure} from 'configureStore';
var store = configure();

firebase.auth().onAuthStateChanged((user) => {
  const { login, logout } = accounts
  if (user) {
    store.dispatch(login({
      name: user.displayName,
      profilePic: user.photoURL,
      verified: user.emailVerified
    }));
  } else {
    store.dispatch(logout())
  }
})

//render
ReactDOM.render(
  <Provider store={store}>
    {Router}
  </Provider>,
  document.getElementById('app')
);
