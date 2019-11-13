import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({
  className,
  dirty,
  isSubmitting,
  title,
}) =>(
  <button type="submit" className={`btn btn-primary ${className} ${(isSubmitting || !dirty) && 'disabled'} ${(isSubmitting) && 'animated pulse infinite'}`}  disabled={(isSubmitting || !dirty)}>
    {isSubmitting ? 'Submitting' : title}
  </button>
)

SubmitButton.propTypes ={
  title                     : PropTypes.string.isRequired,
  className                 : PropTypes.string.isRequired,
  dirty                     : PropTypes.bool.isRequired,
  isSubmitting              : PropTypes.bool.isRequired,
}

SubmitButton.defaultProps = {
  className                 : "",
}

export default SubmitButton