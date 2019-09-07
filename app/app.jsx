//Modules
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
// Personal Modules
import Router from 'app/router/';

//App CSS
require('applicationStyles');

//App JS
require('myJS/all.jsx');

// For react-redux
import {configure} from 'configureStore';
var store = configure();

//render
ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('app')
);