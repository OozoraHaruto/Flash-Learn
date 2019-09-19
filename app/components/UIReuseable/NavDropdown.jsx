import React from 'react'
import PropTypes from 'prop-types';

const NavDropdown = ({
  title,
  id,
  topBar,
  children,
  listClassName,
  linkClassName,
  menuClassName,
}) => {
  return (
    <li className={"nav-item dropdown " + listClassName} data-toggle={topBar && "collapse"} data-target={topBar && ".navbar-collapse.show"} style={{ zIndex: 1021}}>
      <a className={"nav-link dropdown-toggle " + linkClassName} href="#" id={id}role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {title}
        </a>
      <div className={"dropdown-menu " + menuClassName} aria-labelledby={id}>
        {children}
      </div>
    </li>
  )
}

NavDropdown.propTypes = {
  title         : PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
  id            : PropTypes.string.isRequired,
  topBar        : PropTypes.bool.isRequired,
  listClassName : PropTypes.string.isRequired,
  linkClassName : PropTypes.string.isRequired,
  menuClassName : PropTypes.string.isRequired,
}

NavDropdown.defaultProps = {
  topBar        : false,
  listClassName : "",
  linkClassName : "",
  menuClassName : "",
}

export default NavDropdown