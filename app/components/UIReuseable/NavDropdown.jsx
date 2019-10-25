import React from 'react'
import PropTypes from 'prop-types';

const NavDropdown = ({
  children,
  id,
  linkClassName,
  listClassName,
  menuClassName,
  title,
  topBar,
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
  id            : PropTypes.string.isRequired,
  linkClassName : PropTypes.string.isRequired,
  listClassName : PropTypes.string.isRequired,
  menuClassName : PropTypes.string.isRequired,
  title         : PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
  topBar        : PropTypes.bool.isRequired,
}

NavDropdown.defaultProps = {
  linkClassName : "",
  listClassName : "",
  menuClassName : "",
  topBar        : false,
}

export default NavDropdown