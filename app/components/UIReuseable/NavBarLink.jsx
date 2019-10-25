import React from 'react'
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavBarLink = ({
  activeClassName,
  className,
  title,
  to,
}) => {
  return(
    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
      <NavLink className={className} to={to} activeClassName={activeClassName}>{title}</NavLink>
    </li>
  )
}

NavBarLink.propTypes ={
  activeClassName     : PropTypes.string,
  className           : PropTypes.string,
  title               : PropTypes.string,
  to                  : PropTypes.string.isRequired,
}

NavBarLink.defaultProps = {
  activeClassName     : "active",
  className           : "nav-link",
}

export default NavBarLink