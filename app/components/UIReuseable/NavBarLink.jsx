import React from 'react'
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBarLink = ({
  title,
  className,
  to,
  activeClassName,
}) => {
  return(
    <li className="nav-item">
      <NavLink className={className} to={to} activeClassName={activeClassName}>{title}</NavLink>
    </li>
  )
}

NavBarLink.propTypes ={
  title               : PropTypes.string,
  className           : PropTypes.string,
  to                  : PropTypes.string.isRequired,
  activeClassName     : PropTypes.string,
}

NavBarLink.defaultProps = {
  className           : "nav-link",
  activeClassName     : "active",
}

export default NavBarLink