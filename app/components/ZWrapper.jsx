import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
const crypto = require('crypto');

import { NavBarLink, NormLink, NavDropdown } from 'reuse';
import { auth } from 'firebase'

const ZWrapper = ({
  children,
  location : {pathname}
}) =>{
  const renderRightSideBarLoggedIn = () => {
    return (
      <React.Fragment>
        <NavDropdown title={<img src={`${auth.currentUser.photoURL || `https://secure.gravatar.com/avatar/${crypto.createHash('md5').update(auth.currentUser.email).digest("hex")}`}?s=36`} alt="Profile Picture" className="rounded-circle" />} id="navProfile" linkClassName="pt-0 pl-0 pb-0" menuClassName="dropdown-menu-right" topBar>
          <div className="dropdown-item-text text-muted">{`Hi ${auth.currentUser.displayName || "君の名は？"}`}</div>
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
        <NavBarLink to={`/login?from=${encodeURI(pathname)}`} title="Login" />
        <NavBarLink to="/signup" title="Sign Up" />
      </React.Fragment>
    )
  }

  const renderLeftSideBarLoggedIn = () => {
    return (
      <React.Fragment>
      </React.Fragment>
    )
  }

  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/"><img src="/images/icons/icon.png" width="30" height="30" alt=""/> Flash Learn</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <NavDropdown title="Decks" id="navDeck" topBar>
              <NormLink to="/deck/add" title="Add Decks" className="dropdown-item" />
              <div className="dropdown-divider" />
              <NormLink to="/deck" title="Browse" className="dropdown-item" />
            </NavDropdown>
            {(!jQuery.isEmptyObject(auth.currentUser)) && renderLeftSideBarLoggedIn()}
            <NavDropdown title="FAQ" id="navFAQ" topBar>
              <NormLink to="/faq/decks" title="Decks" className="dropdown-item" />
              <NormLink to="/faq/tests" title="Tests" className="dropdown-item" />
              <NormLink to="/faq/gamification" title="Gamification" className="dropdown-item" />
              <NormLink to="/faq/privacyAndCookies" title="Privacy Policies & Cookies" className="dropdown-item" />
              <div className="dropdown-divider" />
              <NormLink to="/faq" title="All" className="dropdown-item" />
            </NavDropdown>

          </ul>
          <ul className="navbar-nav ml-auto">
            {auth.currentUser && renderRightSideBarLoggedIn()}
            {!auth.currentUser && renderRightSideBarLoggedOut()}
          </ul>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default withRouter(ZWrapper);
