import React from 'react'
import PropTypes from 'prop-types';

const Fallback = ({
  message,
  wholePage
}) =>{
  return (
    <div className={`d-flex ${wholePage ? "wholePageWithNav" : "w-100 h-100"} justify-content-center align-items-center`}>
      <div className="p-1 text-center">
        <div className="display-3">
          Loading
          <div className="d-inline-block animated bounce slower infinite">.</div>
          <div className="d-inline-block animated bounce slower infinite delay-1s">.</div>
          <div className="d-inline-block animated bounce slower infinite delay-2s">.</div>
        </div>
        <div className="text-muted">{!message ? "Your page will be loaded soon." : message}</div>
      </div>
    </div>
  )
}

Fallback.propTypes = {
  message: PropTypes.string,
  wholePage: PropTypes.bool.isRequired,
}

Fallback.defaultProps = {
  wholePage: true,
}

export default Fallback