import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class ZWrapper extends React.Component{
  PropTypes = {
    classes: PropTypes.object.isRequired,
  };

  render(){
    return(
      <div>
        <div>Wrapper</div>
        {this.props.children}
      </div>
    )
  }
}
export default ZWrapper;
