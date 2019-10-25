import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';

import { accounts } from 'actions'
import { auth } from 'firebase'
import { pushToError } from 'componentConstants'

export default class Logout extends Component {
  constructor(props) {
    super(props);
    const { startLogoutUser }     = accounts

    this.state = {
      loggedOut                   : false,
      error                       : ""
    }

    startLogoutUser().then(res => {
      if(res.success){
        this.setState({
          loggedOut               : res.success,
          error                   : res.message
        })
        props.history.replace({ pathname: '/' });
      }else{
        throw res
      }
    }).catch(e => {
      return pushToError(this.props.history, this.props.location, e)
    })
  }

  render() {
    var meta = {
      title                       : "Logout"
    }
    var { loggedOut, error }      = this.state;

    return (
      <DocumentMeta {...meta}>
        <div className="container text-center">
          <div className="display-4">{loggedOut ? "Logged Out" : "Logging Out"}</div>
          {error == "" && <div className="pt-4">{loggedOut ? "You've been logged out. Hope to see you soon." : `Please give us a minute, ${auth.currentUser.displayName}`}</div>}
          {error!="" && <div className="text-danger">{"Error: " + error}</div>}
        </div>
      </DocumentMeta>
    )
  }
}