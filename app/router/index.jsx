//Modules
import React, { Component, Suspense, lazy }  from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux'


import { auth } from 'firebase';
import { accounts } from 'actions'
import { authenticatedRoute, unAuthenticatedRoute } from 'app/router/authenticationRoutes'

//Components
import Error404 from 'app/components/Errors/Error404';
import ErrorOthers from 'app/components/Errors/Other';
import Fallback from 'Fallback'
import ZWrapper from 'ZWrapper'
const MainPage            = lazy(() => import(/* webpackChunkName: "cpo_MainPage"        */ 'MainPage'));
const Credits             = lazy(() => import(/* webpackChunkName: "cpo_Credits"         */ 'Credits'));

const AccForgetPassword   = lazy(() => import(/* webpackChunkName: "cpo_ForgetPassword"  */ 'app/components/Account/ForgetPassword'));
const AccReAuth           = lazy(() => import(/* webpackChunkName: "cpo_ReAuthenticate"  */ 'app/components/Account/ReAuthenticate'));
const AccLogin            = lazy(() => import(/* webpackChunkName: "cpo_Login"           */ 'app/components/Account/Login'));
const AccSignUp           = lazy(() => import(/* webpackChunkName: "cpo_SignUp"          */ 'app/components/Account/SignUp'));
const AccLogout           = lazy(() => import(/* webpackChunkName: "cpo_Logout"          */ 'app/components/Account/Logout'));
const AccProfile          = lazy(() => import(/* webpackChunkName: "cpo_Profile"         */ 'app/components/Account/Profile'));
const AccProfileEdit      = lazy(() => import(/* webpackChunkName: "cpo_ProfileEdit"     */ 'app/components/Account/ProfileEdit'));
const AccDeck             = lazy(() => import(/* webpackChunkName: "cpo_DeckFull"        */ 'app/components/Account/DeckFull'));

const DeckAdd             = lazy(() => import(/* webpackChunkName: "cpo_AddDeck"         */ 'app/components/Deck/AddDeck'));
const DeckEdit            = lazy(() => import(/* webpackChunkName: "cpo_EditDeck"        */ 'app/components/Deck/EditDeck'));
const DeckFlashcards      = lazy(() => import(/* webpackChunkName: "cpo_Flashcard"       */ 'app/components/Deck/Flashcard'));
const DeckView            = lazy(() => import(/* webpackChunkName: "cpo_ViewDeck"        */ 'app/components/Deck/View'));
const DeckSearch          = lazy(() => import(/* webpackChunkName: "cpo_SearchDeck"      */ 'app/components/Deck/Search'));

const TestView            = lazy(() => import(/* webpackChunkName: "cpo_TestView"        */ 'app/components/Test/StartTest'));
const TestResult          = lazy(() => import(/* webpackChunkName: "cpo_TestResult"      */ 'app/components/Test/TestResult'));
const TestGenerator       = lazy(() => import(/* webpackChunkName: "cpo_TestGenerator"   */ 'app/components/Test/Generator'));
const TestOptions         = lazy(() => import(/* webpackChunkName: "cpo_TestOption"      */ 'app/components/Test/Options'));

const FAQMenu             = lazy(() => import(/* webpackChunkName: "cpo_FAQMenu"         */ 'app/components/FAQ/index'));
const FAQDecks            = lazy(() => import(/* webpackChunkName: "cpo_FAQDecks"        */ 'app/components/FAQ/Decks'));
const FAQTests            = lazy(() => import(/* webpackChunkName: "cpo_FAQTests"        */ 'app/components/FAQ/Tests'));
const FAQPrivacy          = lazy(() => import(/* webpackChunkName: "cpo_FAQPrivacy"      */ 'app/components/FAQ/Privacy'));
const FAQGamification     = lazy(() => import(/* webpackChunkName: "cpo_FAQGamification" */ 'app/components/FAQ/Gamification'));

// Public - Route
// Not Logged In - NoAuthRoute
// Need Logged In - AuthRoute

const NoAuthRoute = ({ component: Component, ...rest }) => {
  const query             = queryString.parse(rest.location.search)
  const redirect          = !query.from ? "/" : query.from

  const ProtectedRoute = unAuthenticatedRoute({ pathname: redirect})(Component)
  return(
    <Route {...rest} render={(props) => (<ProtectedRoute me={rest.me} {...props} />)} />
  )
}
const AuthRoute = ({ component: Component, ...rest }) => {
  var redirect            = rest.location.pathname
  if (redirect == "/logout") {
    redirect              = ""
  }
  const ProtectedRoute = authenticatedRoute({ pathname: '/login', search: (redirect != "" ? `?from=${redirect}` : "")})(Component)
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
    })
  }

  render(){
   const { me }           = this.state

    return(
      <Router>
        <ZWrapper>
          <Suspense fallback={<Fallback />}>
            <Switch>
              <Route       exact                path='/'                                                                component={MainPage}                 />

              <AuthRoute   exact                path='/reauth'                                                          component={AccReAuth}                me={me}                   />
              <NoAuthRoute exact                path='/login'                                                           component={AccLogin}                 me={me}                   />
              <NoAuthRoute exact                path='/signup'                                                          component={AccSignUp}                me={me}                   />
              <NoAuthRoute exact                path='/forgetpassword'                                                  component={AccForgetPassword}        me={me}                   />
              <AuthRoute   exact                path='/logout'                                                          component={AccLogout}                me={me}                   />
              <AuthRoute   exact                path='/profile/edit'                                                    component={AccProfileEdit}           me={me}                   />
              <Route       exact                path={['/profile/:id','/profile']}                                      component={AccProfile}               me={me}                   />
              <Route       exact                path='/profile/:id/deck/:deckType'                                      component={AccDeck}                  me={me}                   />

              <AuthRoute   exact                path='/deck/add'                                                        component={DeckAdd}                  me={me}                   />
              <AuthRoute   exact                path='/deck/:id/edit'                                                   component={DeckEdit}                 me={me}                   />
              <AuthRoute   exact                path='/deck/:id/flashcards'                                             component={DeckFlashcards}           me={me}                   />


              <AuthRoute   exact                path='/deck/:id/test'                                                   component={TestOptions}              me={me}                   />
              <AuthRoute   exact                path='/deck/:id/test/start'                                             component={TestView}                 me={me}                   />
              <AuthRoute   exact                path='/deck/:id/test/results'                                           component={TestResult}               me={me}                   />
              <AuthRoute   exact                path={['/deck/:id/test/:testType/','/deck/:id/test/:testType/:noOfQn']} component={TestGenerator}            me={me}                   />
              <Route       exact                path='/deck/:id'                                                        component={DeckView}                 me={me}                   />
              <Route       exact                path='/deck'                                                            component={DeckSearch}               me={me}                   />

              <Route       exact                path='/faq'                                                             component={FAQMenu}                  />
              <Route       exact                path='/faq/decks'                                                       component={FAQDecks}                 />
              <Route       exact                path='/faq/tests'                                                       component={FAQTests}                 />
              <Route       exact                path='/faq/gamification'                                                component={FAQGamification}          />
              <Route       exact                path='/faq/privacyAndCookies'                                           component={FAQPrivacy}               />

              <Route       exact                path='/credits'                                                         component={Credits}                  />

              <Route       exact                path='/error/404'                                                       component={Error404}                 />
              <Route       exact                path='/error'                                                           component={ErrorOthers}              />

              <Route       component={Error404} />
            </Switch>
          </Suspense>
        </ZWrapper>
      </Router>
    )
  }
}

export default connect()(ReactRouter)