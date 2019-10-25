import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({
  className,
  dirty,
  submitting,
  title,
}) =>(
  <button type="submit" className={`btn btn-primary ${className} ${(submitting || !dirty) && 'disabled'} ${(submitting) && 'animated pulse infinite'}`}  disabled={(submitting || !dirty)}>
    {submitting ? 'Submitting' : title}
  </button>
)

SubmitButton.propTypes ={
  title                     : PropTypes.string.isRequired,
  className                 : PropTypes.string.isRequired,
  dirty                     : PropTypes.bool.isRequired,
  submitting                : PropTypes.bool.isRequired,
}

SubmitButton.defaultProps = {
  className                 : "",
}

export default SubmitButton