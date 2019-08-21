//Modules
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

// Personal Modules
// import {startGetUserSession} from 'app/actions/account'
import Router from 'app/router/';

//App CSS
require('applicationStyles');

//App JS
require('myJS/all.jsx');


// For react-redux
import {configure} from 'configureStore';
var store = configure();

//check if there is a sessionToken if there is get data from database and add to redux state
// if (localStorage.getItem("sessionToken")) store.dispatch(startGetUserSession());

// Check for user logged in
export var checkLoggedIn = () =>{ //return if user is logged in
  // console.log("auth", store.getState())
  // console.log("logged in", !jQuery.isEmptyObject(store.getState().auth))
  // return (!jQuery.isEmptyObject(store.getState().auth));
}

export var redirectIfLoggedIn = (link = "/") =>{ // Redirect if user is not logged in
  // if (checkLoggedIn()) {window.location.href = link}
}

export var redirectIfNotLoggedIn = (link = "/") =>{
  // if (!checkLoggedIn()) {window.location.href = link}
}

//render
ReactDOM.render(
  <Provider store={store}>
    {Router}
  </Provider>,
  document.getElementById('app')
);
