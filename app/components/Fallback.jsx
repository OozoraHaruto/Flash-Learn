import React from 'react'

const Fallback = () =>{
  return (
    <div className="d-flex wholePageWithNav justify-content-center align-items-center">
      <div className="p-1 text-center">
        <div className="display-3">Loading...</div>
        <div className="text-muted">Your page will be loaded soon.</div>
      </div>
    </div>
  )
}

export default Fallback