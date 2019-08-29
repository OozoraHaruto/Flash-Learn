//Modules
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import firebase from 'app/firebase';

//Components
// import Error404 from 'app/components/Errors/Error404';
import MainPage from 'MainPage';
import ZWrapper from 'ZWrapper';
import Credits from 'Credits';

import AccLogin from 'app/components/Account/Login';
import AccSignUp from 'app/components/Account/SignUp';
import AccLogout from 'app/components/Account/Logout';

import FAQMenu from 'app/components/FAQ/index';
import FAQTests from 'app/components/FAQ/Tests';
import FAQGamification from 'app/components/FAQ/Gamification';

// Public - Route
// Not Logged In - NoAuthRoute
// Need Logged In - AuthRoute

const NoAuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (firebase.auth().currentUser) ? <Redirect to='/' /> : <Component {...props} />
  )} />
)
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (!firebase.auth().currentUser) ? <Redirect to='/login' /> : <Component {...props} />
  )} />
)

export default(
  <Router>
    <ZWrapper>
      <Switch>
        {/* <Route exact path='/' component={MainPage} /> */}
        <Redirect exact from="/" to="/faq" />

        <NoAuthRoute exact path='/login' component={AccLogin} />
        <NoAuthRoute exact path='/signup' component={AccSignUp} />
        <AuthRoute exact path='/logout' component={AccLogout} />

        <Route exact path='/faq' component={FAQMenu} />
        <Route exact path='/faq/tests' component={FAQTests} />
        <Route exact path='/faq/gamification' component={FAQGamification} />


        <Route exact path='/credits' component={Credits} />

        {/* <Route component={Error404} /> */}
      </Switch>
    </ZWrapper>
  </Router>
)
