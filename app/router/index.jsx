//Modules
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

//Components
// import Error404 from 'app/components/Errors/Error404';
import MainPage from 'MainPage';
import ZWrapper from 'ZWrapper';

export default(
  <Router>
    <ZWrapper>
      <Switch>
        <Route exact path='/' component={MainPage}/>

        {/* <Route component={Error404} /> */}
      </Switch>
    </ZWrapper>
  </Router>
)
