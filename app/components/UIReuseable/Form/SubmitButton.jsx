import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({
  title,
  className,
  submitting,
}) =>(
  <button type="submit" className={`btn btn-primary ${className} ${submitting && 'disabled animated pulse infinite'}`} >
    {submitting ? 'Submitting' : title}
  </button>
)

SubmitButton.propTypes ={
  title                     : PropTypes.string.isRequired,
  className                 : PropTypes.string.isRequired,
  submitting                : PropTypes.bool.isRequired,
}

SubmitButton.defaultProps = {
  className                 : "",
}

export default SubmitButton