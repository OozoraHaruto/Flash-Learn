import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { NavBarLink } from 'reuse';

export class ZWrapper extends React.Component{
  render(){
    return(
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <NavLink className="navbar-brand" to="/">Flash Learn</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <NavBarLink to="/faq" title="FAQ" />
            </ul>
          </div>
        </nav>
        {this.props.children}
      </div>
    )
  }
}
export default ZWrapper;
