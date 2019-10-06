import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NormLink = ({
  title,
  className,
  to,
  children,
}) => {
  return(
    <Link className={className} to={to}>{title || children}</Link>
  )
}

NormLink.propTypes ={
  title               : PropTypes.string,
  className           : PropTypes.string.isRequired,
  to                  : PropTypes.string.isRequired,
}

NormLink.defaultProps = {
  className           : "",
}

export default NormLink