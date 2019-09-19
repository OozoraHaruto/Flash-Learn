import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({
  title,
  className,
  submitting,
  dirty,
}) =>(
  <button type="submit" className={`btn btn-primary ${className} ${(submitting || !dirty) && 'disabled'} ${(submitting) && 'animated pulse infinite'}`}  disabled={(submitting || !dirty)}>
    {submitting ? 'Submitting' : title}
  </button>
)

SubmitButton.propTypes ={
  title                     : PropTypes.string.isRequired,
  className                 : PropTypes.string.isRequired,
  submitting                : PropTypes.bool.isRequired,
  dirty                     : PropTypes.bool.isRequired,
}

SubmitButton.defaultProps = {
  className                 : "",
}

export default SubmitButton