import React from 'react'
import { GoUnverified, GoVerified } from 'react-icons/go'

import { accounts } from 'actions'
import { NormLink } from 'reuse'
import * as comConst from 'componentConstants'

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
    const { name, profilePic, verified, isMe, id, subpage = "", points } = this.props

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
    const renderName = () =>{
      if(subpage == ""){
        return name
      }else{
        return (
          <React.Fragment>
            <NormLink className="text-body" title={name} to={`/profile/${id}`} />{`'s ${getAdditionalTextForName()}`}
          </React.Fragment>
        )
      }
    }
    const getAdditionalTextForName = () =>{
      switch (subpage) {
        case comConst.PROFILE_DECK_CREATED:
          return "Created Decks"
        case comConst.PROFILE_DECK_LIKED:
          return "Liked Decks"
      }
    }

    return (
      <div className="container">
        <div className="row p-3">
          <div className="col align-self-center">
            <img src={`${profilePic}?s=200`} className="img-thumbnail" />
          </div>
          <div className="col-9 col-md-10 d-flex flex-column justify-content-center">
            <div>
              <span className="h3 align-middle text-capitalize">{renderName()}</span>
              <span className="align-middle">{isMe && renderVerified()}</span>
              <span className="align-middle">{isMe && !verified && renderEmailStatus()}</span>
            </div>
            {points && <div>{points} point{points > 1 && "s"} earned this month</div>}
            {
              isMe &&
                <div className="mt-1">
                  <NormLink className="btn btn-outline-warning btn-sm" title="Edit Profile" to={{ pathname: "/reauth", state: {to: '/profile/edit'}}} />
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}