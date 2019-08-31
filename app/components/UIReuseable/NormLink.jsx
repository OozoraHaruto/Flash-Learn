import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NormLink = ({
  title,
  className,
  to,
}) => {
  return(
    <Link className={className} to={to}>{title}</Link>
  )
}

NormLink.propTypes ={
  title               : PropTypes.string.isRequired,
  className           : PropTypes.string.isRequired,
  to                  : PropTypes.string.isRequired,
}

NormLink.defaultProps = {
  className           : "",
}

export default NormLink