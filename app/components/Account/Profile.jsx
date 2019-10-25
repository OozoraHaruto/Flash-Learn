import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
import { accounts } from 'actions'
import { 
  PROFILE_DECK_CREATED, 
  PROFILE_DECK_LIKED, 
  pushToError,
} from 'componentConstants'

import { dataLoading } from 'reuse'
import DeckSummary from 'app/components/Account/subComponents/Profile/DeckSummary'
import Fallback from 'Fallback'
import Header from 'app/components/Account/subComponents/Profile/Header'

class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      isMe                              : false,
      profile: {
        name                            : "",
        profilePic                      : "",
        verified                        : false
      },
      likedDecks                        : undefined,
      createdDecks                      : undefined,
      leaderboardPoint                  : undefined,
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.match.params.id != this.props.match.params.id){
      this.setState({
        isMe                            : false,
        profile: {
          name                          : "",
          profilePic                    : "",
          verified                      : false
        },
        likedDecks                      : undefined,
        createdDecks                    : undefined,
        leaderboardPoint                : undefined,
      }, () => this.checkUserId())
    }
  }

  componentDidMount = () => this.checkUserId()

  checkUserId = () =>{
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
      var reduxProfile                  = this.props.profile
      state.profile = {
        name                            : reduxProfile.name,
        profilePic                      : reduxProfile.profilePic,
        verified                        : reduxProfile.verified
      }
    }

    if (auth.currentUser) {
      state.isMe                        = (auth.currentUser.uid == state.id)
      if (state.isMe) {
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

  getUserRelatedDetails = id =>{
    this.getCreatedDecks(id)
    this.getLikedDecks(id)
    this.getLeaderboardPoints(id)
  }

  getProfile = state => {
    const { getUserProfile }            = accounts
    const {id, profile}                 = state
    if (profile.name != "") { return this.getUserRelatedDetails(id) }

    getUserProfile(id).then(res =>{
      if(!res.success){
        throw res
      } else {
        this.getUserRelatedDetails(id)
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
    }).catch(e => {
      return pushToError(this.props.history, this.props.location, e)
    })
  }

  getCreatedDecks = id =>{
    const { getCreatedDecks }           = accounts

    getCreatedDecks(id, 5).then(res =>{
      if(!res.success){
        throw res
      }else{
        this.setState({
          ...this.state,
          createdDecks                  : res.data
        })
      }
    }).catch(e => {
      this.getCreatedDecks(id)
    })
  }

  getLikedDecks = id =>{
    const { getLikedDecks }             = accounts

    getLikedDecks(id, 5).then(res => {
      if (!res.success) {
        throw res
      } else {
        this.setState({
          ...this.state,
          likedDecks                    : res.data
        })
      }
    }).catch(e => {
      this.getLikedDecks(id)
    })
  }

  getLeaderboardPoints = id =>{
    const { getUserPointLeaderboard }   = accounts

    getUserPointLeaderboard(id).then(res=>{
      if (!res.success) {
        throw res
      } else {
        this.setState({
          ...this.state,
          leaderboardPoint: (res.doc.exists ? res.doc.data().point : 0)
        })
      }
    }).catch(e => {
      this.getLeaderboardPoints(id)
    })
  }

  render() {
    const { 
      createdDecks, 
      id,
      isMe, 
      leaderboardPoint,
      likedDecks, 
      profile, 
    }                                   = this.state
    const LoadingLikedDecks             = dataLoading(false, `The ${profile.name}'s liked decks should be loaded soon`)(DeckSummary)
    const LoadingCreatedDecks           = dataLoading(false, `The ${profile.name} created decks should be loaded soon`)(DeckSummary)

    return (
      <DocumentMeta title={(!profile.name ? "Loading profile" : `${profile.name}'s profile`)}>
        {profile.name == "" && <Fallback />}
        <div className="container-fluid">
          <div className="row bg-light">
            {profile.name != "" && <Header {...profile} isMe={isMe} points={leaderboardPoint}  />}
          </div>
        </div>
        {profile.name != "" && <LoadingCreatedDecks loading={createdDecks == undefined} title="Created Decks" cards={createdDecks} seeAllLink={PROFILE_DECK_CREATED} userId={id} />}
        {profile.name != "" && <LoadingLikedDecks loading={likedDecks == undefined} title="Liked Decks" cards={likedDecks} seeAllLink={PROFILE_DECK_LIKED} userId={id} hideFooter={true}/>}
      </DocumentMeta>
    )
  }
}

export default connect(state =>{
  return{
    profile: state.currentProfileReducer
  }
})(Profile)