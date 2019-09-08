//Modules
import React, { Component, Suspense, lazy }  from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux'


import { auth } from 'firebase';
import { accounts } from 'actions'
import { authenticatedRoute, unAuthenticatedRoute } from 'app/router/authenticationRoutes'

//Components
// import Error404 from 'app/components/Errors/Error404';
import Fallback from 'app/components/Fallback';
import ZWrapper from 'ZWrapper'
const MainPage            = lazy(() => import(/* webpackChunkName: "cpo_MainPage" */ 'MainPage'));
const Credits             = lazy(() => import(/* webpackChunkName: "cpo_Credits" */ 'Credits'));

const AccLogin            = lazy(() => import(/* webpackChunkName: "cpo_Login" */ 'app/components/Account/Login'));
const AccSignUp           = lazy(() => import(/* webpackChunkName: "cpo_SignUp" */ 'app/components/Account/SignUp'));
const AccLogout           = lazy(() => import(/* webpackChunkName: "cpo_Logout" */ 'app/components/Account/Logout'));
const AccProfile          = lazy(() => import(/* webpackChunkName: "cpo_Profile" */ 'app/components/Account/Profile'));

const DeckAdd             = lazy(() => import(/* webpackChunkName: "cpo_AddDeck" */ 'app/components/Deck/AddDeck'));

const FAQMenu             = lazy(() => import(/* webpackChunkName: "cpo_FAQMenu" */ 'app/components/FAQ/index'));
const FAQTests            = lazy(() => import(/* webpackChunkName: "cpo_FAQTests" */ 'app/components/FAQ/Tests'));
const FAQGamification     = lazy(() => import(/* webpackChunkName: "cpo_FAQGamification" */ 'app/components/FAQ/Gamification'));

// Public - Route
// Not Logged In - NoAuthRoute
// Need Logged In - AuthRoute

const NoAuthRoute = ({ component: Component, ...rest }) => {
  const query             = queryString.parse(rest.location.search)
  const redirect          = !query.from ? "/" : query.from
  
  const ProtectedRoute = unAuthenticatedRoute(redirect)(Component)
  return(
    <Route {...rest} render={(props) => (<ProtectedRoute me={rest.me} {...props} />)} />
  )
}
const AuthRoute = ({ component: Component, ...rest }) => {
  var redirect            = rest.location.pathname
  if (redirect == "/logout") {
    redirect = ""
  }
  const ProtectedRoute = authenticatedRoute(`/login${(redirect != "" ? `?from=${redirect}` : "")}`)(Component)
  return(
    <Route {...rest} render={(props) => (<ProtectedRoute me={rest.me} {...props} />)} />
  )
}

class ReactRouter extends Component{
  constructor(){
    super()
    this.state ={
      me: auth.currentUser
    }
  }

  componentDidMount(){
    auth.onAuthStateChanged((user) => {
      this.setState({ me: user })
      const { login, logout } = accounts
      if (user) {
        this.props.dispatch(login({
          name: user.displayName,
          profilePic: user.photoURL,
          verified: user.emailVerified
        }));
      } else {
        this.props.dispatch(logout())
      }
    })
  }

  render(){
   const { me }                 = this.state
    
    return(
      <Router>
        <ZWrapper>
          <Suspense fallback={<Fallback />}>
            <Switch>
              {/* <Route exact path='/' component={MainPage} /> */}
              <Redirect exact from="/" to="/faq" />

              <NoAuthRoute exact path='/login' component={AccLogin} me={me} />
              <NoAuthRoute exact path='/signup' component={AccSignUp} me={me} />
              <AuthRoute exact path='/logout' component={AccLogout} me={me} />
              <Route exact path={['/profile/:id', '/profile']} component={AccProfile} me={me} />

              <AuthRoute exact path='/deck/add' component={DeckAdd} me={me} />

              <Route exact path='/faq' component={FAQMenu} />
              <Route exact path='/faq/tests' component={FAQTests} />
              <Route exact path='/faq/gamification' component={FAQGamification} />


              <Route exact path='/credits' component={Credits} />

              {/* <Route component={Error404} /> */}
            </Switch>
          </Suspense>
        </ZWrapper>
      </Router>
    )
  }
}

export default connect()(ReactRouter)