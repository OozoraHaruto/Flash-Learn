import React from 'react'
import { GoUnverified, GoVerified } from 'react-icons/go'

import { accounts } from 'actions'

const sendVerificationEmailToUser = () =>{
  const { sendVerificationEmail } = accounts

  sendVerificationEmail().then(res =>{
    console.log("email sent", res)
  })
}

const Header = ({ 
  name, 
  profilePic, 
  verified,
  isMe,
}) => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  const renderVerified = () =>{
    if (verified){
      return (
        <span className="ml-2 text-success" data-toggle="tooltip" data-placement="bottom" title="Verified"><GoVerified /></span>
      )
    }else{
      return (
        <button type="button" className="btn btn-link text-danger p-0" onClick={() => sendVerificationEmailToUser()} data-toggle="tooltip" data-placement="bottom" data-html="true" title="Not Verified<br />Click to resend verification"><GoUnverified /></button>
      )
    }
  }

  return(
    <div className="container">
      <div className="row p-3">
        <div className="col">
          <img src={`${profilePic}?s=200`} className="img-thumbnail" />
        </div>
        <div className="col-10 d-flex align-items-center">
          <div>
            <span className="h3 align-middle">{name}</span>
            <span className="align-middle">{isMe && renderVerified()}</span>
          </div>
          <div>
            {/* TODO: Add monthly points here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
