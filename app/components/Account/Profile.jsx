import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
import Fallback from 'Fallback'
import { dataLoading } from 'reuse'
import Header from 'app/components/Account/subComponents/Profile/Header'
import DeckSummary from 'app/components/Account/subComponents/Profile/DeckSummary'
import { accounts } from 'actions'
import * as comConst from 'componentConstants'

class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      isMe                              : false,
      profile                           : {
        name                            : "",
        profilePic                      : "",
        verified                        : false
      },
      subscribedDecks                   : undefined,
      createdDecks                      : undefined,
    }
  }
  componentDidMount(){
    var state                           = this.state

    if (!this.props.match.params.id) {
      if (!auth.currentUser) {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
      } else {
        state.id                        = auth.currentUser.uid
      }
    } else {
      state.id                          = this.props.match.params.id
    }

    if (this.props.profile.id == state.id) {
      var reduxProfile = this.props.profile
      state.profile = {
        name                            : reduxProfile.name,
        profilePic                      : reduxProfile.profilePic,
        verified                        : reduxProfile.verified
      }
    }

    if (auth.currentUser) {
      state.isMe                        = (auth.currentUser.uid == state.id)
      if (state.isMe && state.profile.name == "") {
        const user                      = auth.currentUser
        if (user.displayName) {
          state.profile = {
            name                        : user.displayName,
            profilePic                  : user.photoURL,
            verified                    : user.emailVerified
          }
          this.setReduxProfile(state.id, user.displayName, user.photoURL, user.emailVerified)
        }
      } 
    }

    this.setState(state)
    this.getProfile(state)
    this.getCreatedDecks(state.id)
    this.getSubscribedDecks(state.id)
  }

  setReduxProfile = (id, name, pic, verified) =>{
    const { addProfileToRedux }         = accounts
    this.props.dispatch(addProfileToRedux({
      id,
      name,
      profilePic                        : pic,
      verified
    }))
  }

  getProfile = state =>{
    const { getUserProfile }            = accounts
    const {id, profile} = state
    if(profile.name != ""){ return }

    getUserProfile(id).then(res =>{
      if(!res.success){
        this.props.history.replace({ pathname: '/' });
      }else{
        this.setReduxProfile(id, res.data.displayName, res.data.photoURL, res.data.emailVerified)
        this.setState({
          ...this.state,
          profile                       :{
            name                        : res.data.displayName,
            profilePic                  : res.data.photoURL,
            verified                    : res.data.emailVerified
          }
        })
      }
    })
  }

  getCreatedDecks = id =>{
    const { getCreatedDecks }           = accounts

    getCreatedDecks(id, 5).then(res =>{
      if(!res.success){
        this.props.history.replace({ pathname: '/' });
      }else{
        this.setState({
          ...this.state,
          createdDecks                  : res.data
        })
      }
    })
  }

  getSubscribedDecks = id =>{
    const { getSubscribedDecks }        = accounts

    getSubscribedDecks(id, 5).then(res => {
      if (!res.success) {
        this.props.history.replace({ pathname: '/' });
      } else {
        this.setState({
          ...this.state,
          subscribedDecks               : res.data
        })
      }
    })
  }

  render() {
    const { 
      id,
      isMe, 
      profile, 
      subscribedDecks, 
      createdDecks, 
    }                                   = this.state
    const LoadingSubscribedDecks        = dataLoading(false, `The ${profile.name}'s subscribed decks should be loaded soon`)(DeckSummary)
    const LoadingCreatedDecks           = dataLoading(false, `The ${profile.name} created decks should be loaded soon`)(DeckSummary)

    return (
      <DocumentMeta title={(!profile.name ? "Loading profile" : `${profile.name}'s profile`)}>
        {profile.name == "" && <Fallback />}
        <div className="container-fluid">
          <div className="row bg-light">
            {profile.name != "" && <Header {...profile} isMe={isMe} />}
          </div>
        </div>
        {profile.name != "" && <LoadingCreatedDecks loading={createdDecks == undefined} title="Created Decks" cards={createdDecks} seeAllLink={comConst.PROFILE_DECK_CREATED} userId={id} />}
        {profile.name != "" && <LoadingSubscribedDecks loading={subscribedDecks == undefined} title="Subscribed Decks" cards={subscribedDecks} seeAllLink={comConst.PROFILE_DECK_SUBSCRIBED} userId={id} hideFooter={true}/>}
      </DocumentMeta>
    )
  }
}

export default connect(state =>{
  return{
    profile: state.currentProfileReducer
  }
})(Profile)