import React from 'react'

const Fallback = () =>{
  return (
    <div className="d-flex wholePageWithNav justify-content-center align-items-center">
      <div className="p-1 text-center">
        <div className="display-3">
          Loading
          <div className="d-inline-block animated bounce slower infinite">.</div>
          <div className="d-inline-block animated bounce slower infinite delay-1s">.</div>
          <div className="d-inline-block animated bounce slower infinite delay-2s">.</div>
        </div>
        <div className="text-muted">Your page will be loaded soon.</div>
      </div>
    </div>
  )
}

export default Fallback