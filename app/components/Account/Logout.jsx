import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';

import { accounts } from 'actions'

class Logout extends Component {
  constructor(props) {
    super(props);
    const { startLogoutUser }     = accounts

    this.state = {
      loggedOut     : false,
      error         : ""
    }

    startLogoutUser().then(res => {
      this.setState({
        loggedOut   : res.success,
        error       : res.message
      })
      props.history.replace({ pathname: '/' });
    })
  }

  render() {
    var meta = {
      title: "Logout"
    }
    var { loggedOut, error }      = this.state;

    return (
      <DocumentMeta {...meta}>
        <div className="container text-center">
          <div className="display-4">{loggedOut ? "Logged Out" : "Logging Out"}</div>
          {error=="" && <div className="pt-4">{loggedOut ? "You've been logged out. Hope to see you soon." : ("Please give us a minute, " + this.props.auth.name)}</div>}
          {error!="" && <div className="text-danger">{"Error: " + error}</div>}
        </div>
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    auth: state.authReducer
  }
})(Logout);