import React, { Component } from 'react'
import { connect } from 'react-redux'

import { auth, database } from 'firebase';
import Header from 'app/components/Account/subComponents/Profile/Header'
import { accounts } from 'actions'

class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMe: false,
      details: {
        name: "",
      },
      cards: {}
    }
  }
  componentDidMount() {
    var state = this.state
    // TODO: load all the shit
  }

  render() {
    const { isMe, details, cards } = this.state
    const { id } = this.props.match.params

    return (
      <div className="container-fluid">
        <div className="row bg-light">
          {id}
          {/* {profile.name != "" && <Header {...profile} isMe={isMe} />} */}
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  return {
    auth: state.authReducer
  }
})(View)