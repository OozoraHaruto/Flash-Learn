import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NormLink = ({
  children,
  className,
  title,
  to,
}) => {
  return(
    <Link className={className} to={to}>{title || children}</Link>
  )
}

NormLink.propTypes ={
  className           : PropTypes.string.isRequired,
  title               : PropTypes.string,
  to                  : PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
}

NormLink.defaultProps = {
  className           : "",
}

export default NormLink