import React from 'react';
import PropTypes from 'prop-types';

const MiddleWrapper = ({
  boxSizing,
  children,
}) => {
  return (
    <div className="d-flex wholePageWithNav justify-content-center align-items-center">
      <div className={`form-wrapper ${boxSizing} border rounded shadow-sm p-4`}>
        {children}
      </div>
    </div>
  )
}

MiddleWrapper.propTypes = {
  boxSizing       : PropTypes.string.isRequired,
  children        : PropTypes.object.isRequired,
}

export default MiddleWrapper;