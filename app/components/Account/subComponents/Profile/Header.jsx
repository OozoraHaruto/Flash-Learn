import React from 'react'
import { GoUnverified, GoVerified } from 'react-icons/go'

import { accounts } from 'actions'

export default class Header extends React.Component {
  constructor(){
    super()
    this.state = {
      verificationEmailStatus: undefined
    }
  }

  componentDidMount(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  sendVerificationEmailToUser = () => {
    if(this.state.verificationEmailStatus != undefined){
      return
    }

    const { sendVerificationEmail } = accounts
    this.setState({
      verificationEmailStatus: "sending"
    })

    sendVerificationEmail().then(res => {
      console.log("email sent", res)
      this.setState({
        verificationEmailStatus: "sent"
      })
    })
  }

  render(){
    const { name, profilePic, verified, isMe, } = this.props

    const renderVerified = () => {
      if (verified) {
        return (
          <span className="ml-2 text-success" data-toggle="tooltip" data-placement="bottom" title="Verified"><GoVerified /></span>
        )
      } else {
        return (
          <button type="button" className="btn btn-link text-danger p-0" onClick={() => this.sendVerificationEmailToUser()} data-toggle="tooltip" data-placement="bottom" data-html="true" title="Not Verified<br />Click to resend verification"><GoUnverified /></button>
        )
      }
    }
    const renderEmailStatus = () =>{
      const emailStatusMessage = () => {
        switch (this.state.verificationEmailStatus) {
          case "sending":
            return "Sending email"
          case "sent":
            return "Email sent"
        }
      }

      if (this.state.verificationEmailStatus != undefined){
        return <small className="text-muted ">{emailStatusMessage()}</small>
      }
    }

    return (
      <div className="container">
        <div className="row p-3">
          <div className="col align-self-center">
            <img src={`${profilePic}?s=200`} className="img-thumbnail" />
          </div>
          <div className="col-9 col-md-10 d-flex align-items-center">
            <div>
              <span className="h3 align-middle text-capitalize">{name}</span>
              <span className="align-middle">{isMe && renderVerified()}</span>
              <span className="align-middle">{isMe && !verified && renderEmailStatus()}</span>
            </div>
            <div>
              {/* TODO: Add monthly points here */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}