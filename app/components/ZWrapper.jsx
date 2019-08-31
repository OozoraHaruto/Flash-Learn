import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { NavBarLink, NormLink, NavDropdown } from 'reuse';

const ZWrapper = ({
  auth,
  children
}) =>{
  const renderRightSideBarLoggedIn = () => {
    var { name, profilePic } = auth;
    return (
      <React.Fragment>
        <NavDropdown title={<img src={profilePic + "?s=36"} alt="Profile Picture" className="rounded-circle" />} id="navFAQ" linkClassName="pt-0 pl-0 pb-0" menuClassName="dropdown-menu-right" topBar>
          <span className="dropdown-item-text">Hi {name}</span>
          <NormLink to="/profile" title="Profile" className="dropdown-item" />
          <div className="dropdown-divider" />
          <NormLink to="/logout" title="Logout" className="dropdown-item" />
        </NavDropdown>
      </React.Fragment>
    )
  }

  const renderRightSideBarLoggedOut = () => {
    return (
      <React.Fragment>
        <NavBarLink to="/login" title="Login" />
        <NavBarLink to="/signup" title="Sign Up" />
      </React.Fragment>
    )
  }

  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">Flash Learn</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <NavDropdown title="FAQ" id="navFAQ" topBar>
              <NormLink to="/faq/tests" title="Tests" className="dropdown-item" />
              <NormLink to="/faq/gamification" title="Gamification" className="dropdown-item" />
              <div className="dropdown-divider" />
              <NormLink to="/faq" title="All" className="dropdown-item" />
            </NavDropdown>

          </ul>
          <ul className="navbar-nav ml-auto">
            {(!jQuery.isEmptyObject(auth)) && renderRightSideBarLoggedIn()}
            {(jQuery.isEmptyObject(auth)) && renderRightSideBarLoggedOut()}
          </ul>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default withRouter(
  connect((state) => {
    return {
      auth: state.authReducer
    }
  })(ZWrapper)
);
