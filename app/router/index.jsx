//Modules
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

//Components
// import Error404 from 'app/components/Errors/Error404';
import MainPage from 'MainPage';
import ZWrapper from 'ZWrapper';
import Credits from 'Credits';


import FAQMenu from 'app/components/FAQ/index';
import FAQTests from 'app/components/FAQ/Tests';
import FAQGamification from 'app/components/FAQ/Gamification';

export default(
  <Router>
    <ZWrapper>
      <Switch>
        {/* <Route exact path='/' component={MainPage} /> */}
        <Redirect exact from="/" to="/faq" />

        <Route exact path='/faq' component={FAQMenu} />
        <Route exact path='/faq/tests' component={FAQTests} />
        <Route exact path='/faq/gamification' component={FAQGamification} />


        <Route exact path='/credits' component={Credits} />

        {/* <Route component={Error404} /> */}
      </Switch>
    </ZWrapper>
  </Router>
)
