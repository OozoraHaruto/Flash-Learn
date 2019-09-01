//Modules
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import queryString from 'query-string';

// Personal Modules
import Router from 'app/router/';
// import { auth } from 'firebase';
// import { accounts } from 'actions'

//App CSS
require('applicationStyles');

//App JS
require('myJS/all.jsx');

// For react-redux
import {configure} from 'configureStore';
var store = configure();

// auth.onAuthStateChanged((user) => {
//   const { login, logout } = accounts
//   if (user) {
//     store.dispatch(login({
//       name: user.displayName,
//       profilePic: user.photoURL,
//       verified: user.emailVerified
//     }));
//     // var query = queryString.parse(location.search)
//     // console.log(query.from, location.search)
//     // // window.location.replace(query.from);
//     // window.location.href = query.from 
//   } else {
//     store.dispatch(logout())
//   }
// })

//render
ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('app')
);