//Modules
import React, { Suspense, lazy }  from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import queryString from 'query-string';

import firebase from 'app/firebase';

//Components
// import Error404 from 'app/components/Errors/Error404';
// import Fallback from 'app/components/Fallback';
// const MainPage            = lazy(() => import(/* webpackChunkName: "cpo_MainPage" */ 'MainPage'));
// const ZWrapper            = lazy(() => import(/* webpackChunkName: "cpo_ZWrapper" */ 'ZWrapper'));
// const Credits             = lazy(() => import(/* webpackChunkName: "cpo_Credits" */ 'Credits'));

// const AccLogin            = lazy(() => import(/* webpackChunkName: "cpo_Login" */ 'app/components/Account/Login'));
// const AccSignUp           = lazy(() => import(/* webpackChunkName: "cpo_SignUp" */ 'app/components/Account/SignUp'));
// const AccLogout           = lazy(() => import(/* webpackChunkName: "cpo_Logout" */ 'app/components/Account/Logout'));
// const AccProfile           = lazy(() => import(/* webpackChunkName: "cpo_Profile" */ 'app/components/Account/Profile'));

// const FAQMenu             = lazy(() => import(/* webpackChunkName: "cpo_FAQMenu" */ 'app/components/FAQ/index'));
// const FAQTests            = lazy(() => import(/* webpackChunkName: "cpo_FAQTests" */ 'app/components/FAQ/Tests'));
// const FAQGamification     = lazy(() => import(/* webpackChunkName: "cpo_FAQGamification" */ 'app/components/FAQ/Gamification'));

import Fallback from 'app/components/Fallback';

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

const NoAuthRoute = ({ component: Component, ...rest }) => {
  var query               = queryString.parse(rest.location.search)
  return ((
    <Route {...rest} render={(props) => (
      (firebase.auth().currentUser) ? <Redirect to={!query.from ? "/" : query.from } /> : <Component {...props} />
    )} />
  ))
}
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (!firebase.auth().currentUser) ? <Redirect to={`/login?from=${encodeURI(rest.location.pathname)}`} /> : <Component {...props} />
  )} />
)

export default(
  <Router>
    <Suspense fallback={<Fallback />}>
      <ZWrapper>
        <Switch>
          {/* <Route exact path='/' component={MainPage} /> */}
          <Redirect exact from="/" to="/faq" />

          <NoAuthRoute exact path='/login' component={AccLogin} />
          <NoAuthRoute exact path='/signup' component={AccSignUp} />
          <AuthRoute exact path='/logout' component={AccLogout} />
          {/* <Route exact path={['/profile/:id', '/profile']} component={AccProfile} /> */}

          <Route exact path='/faq' component={FAQMenu} />
          <Route exact path='/faq/tests' component={FAQTests} />
          <Route exact path='/faq/gamification' component={FAQGamification} />


          <Route exact path='/credits' component={Credits} />

          {/* <Route component={Error404} /> */}
        </Switch>
      </ZWrapper>
    </Suspense>
  </Router>
)
