import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
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
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
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
      <DocumentMeta title={(!profile.name ? "Loading profile" : `${profile.name}'s profile`)}>
        <div className="container-fluid">
          <div className="row bg-light">
            {profile.name != "" && <Header {...profile} isMe={isMe} />}
          </div>
        </div>
      </DocumentMeta>
    )
  }
}

export default Profile