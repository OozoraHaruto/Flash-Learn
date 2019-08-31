import React, { Component } from 'react'
import { connect } from 'react-redux'

import { auth, database } from 'firebase';
import Header from 'app/components/Account/subComponents/Profile/Header'
import { accounts } from 'actions'

class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      isMe                              : false,
      profile                           : {
        name                            : "",
        profilePic                      : "",
        verified                        : false
      }
    }
  }
  componentDidMount(){
    var state = this.state

    if (!this.props.match.params.id) {
      if (!auth.currentUser) {
        state.id = "asd" // FIXME: Cannot push history, temp fix
        // this.props.history.push({ pathname: `/login?from=${encodeURI(this.props.location.pathname)}` })
      } else {
        state.id = auth.currentUser.uid
      }
    } else {
      state.id = this.props.match.params.id
    }

    if (auth.currentUser) {
      state.isMe = (auth.currentUser.uid == state.id)
      if (state.isMe) {
        const user = auth.currentUser
        if (user.displayName) {
          state.profile = {
            name: user.displayName,
            profilePic: user.photoURL,
            verified: user.emailVerified
          }
        }

      }
    }
    // console.log("asd", state.id, props)

    this.setState(state)
    this.getProfile(state)
  }

  getProfile = state =>{
    const { getUserProfile }            = accounts
    const {id, profile} = state
    if(profile.name != ""){ return }

    getUserProfile(id).then(res =>{
      if(!res.success){
        this.props.history.replace({ pathname: '/' });
      }else{
        this.setState({
          ...this.state,
            profile                     :{
              name                      : res.data.displayName,
              profilePic                : res.data.photoURL,
              verified                  : res.data.emailVerified
            }
        })
      }
    })
  }

  render() {
    const { isMe, profile } = this.state
    return (
      <div className="container">
        {profile.name != "" && <Header {...profile} isMe={isMe} />}
      </div>
    )
  }
}

export default connect((state) => {
  return {
    auth: state.authReducer
  }
})(Profile)