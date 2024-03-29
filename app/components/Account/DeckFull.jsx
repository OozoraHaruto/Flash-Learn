import React from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux'
import { FaFrown } from "react-icons/fa";

import { accounts } from 'actions'
import { auth } from 'firebase';
import { 
  PROFILE_DECK_CREATED, 
  PROFILE_DECK_LIKED,
  pushToError,
 } from 'componentConstants'

import Card from 'app/components/Account/subComponents/Profile/CardLink'
import Fallback from 'Fallback'
import Header from 'app/components/Account/subComponents/Profile/Header'

class DeckFull extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      isMe                            : false,
      profile                         : {
        name                          : "",
        profilePic                    : "",
        verified                      : false
      },
      decks                           : [],
      decksLoading                    : true,
    }
  }

  componentDidMount(){
    var state                         = this.state
    state.id                          = this.props.match.params.id

    if(auth.currentUser){
      state.isMe                      = (auth.currentUser.uid == this.props.match.params.id)
    }
    if (this.props.profile.id == this.props.match.params.id) {
      var reduxProfile = this.props.profile
      state.profile = {
        name                          : reduxProfile.name,
        profilePic                    : reduxProfile.profilePic,
        verified                      : reduxProfile.verified
      }
      this.loadDecksData()
    }

    this.setState(state)
    this.getProfile(state)
  }

  setReduxProfile = (id, name, pic, verified) => {
    const { addProfileToRedux } = accounts
    this.props.dispatch(addProfileToRedux({
      id,
      name,
      profilePic                      : pic,
      verified
    }))
  }

  getProfile = state => {
    const { getUserProfile }          = accounts
    const { id, profile }             = state
    if (profile.name != "") { return }

    getUserProfile(id).then(res => {
      if (!res.success) {
        throw res
      } else {
        this.setReduxProfile(id, res.data.displayName, res.data.photoURL, res.data.emailVerified)
        this.setState({
          ...this.state,
          profile: {
            name                      : res.data.displayName,
            profilePic                : res.data.photoURL,
            verified                  : res.data.emailVerified
          }
        })
        this.loadDecksData()
      }
    }).catch(e => {
      return pushToError(this.props.history, this.props.location, e)
    })
  }

  loadDecksData = () => {
    switch (this.props.match.params.deckType) {
      case PROFILE_DECK_CREATED:
        this.getCreatedDecks(); break;
      case PROFILE_DECK_LIKED:
        this.getLikedDecks(); break;
    }
  }

  getCreatedDecks = () => {
    const { getCreatedDecks }         = accounts

    getCreatedDecks(this.props.match.params.id).then(res => {
      if (!res.success) {
        throw res
      } else {
        this.setState({
          ...this.state,
          decks                       : res.data,
          decksLoading                : false
        })
      }
    }).catch(e => {
      this.getCreatedDecks()
    })
  }

  getLikedDecks = () => {
    const { getLikedDecks }      = accounts

    getLikedDecks(this.props.match.params.id).then(res => {
      if (!res.success) {
        throw res
      } else {
        this.setState({
          ...this.state,
          decks                       : res.data,
          decksLoading                : false
        })
      }
    }).catch(e => {
      this.getLikedDecks()
    })
  }

  render(){
    var { 
      isMe, 
      profile, 
      decks, 
      decksLoading, 
    }                                 = this.state

    const generateEmptyArrayMessage = () =>{
      switch (this.props.match.params.deckType) {
        case PROFILE_DECK_CREATED:
          return `User has not create any decks`
        case PROFILE_DECK_LIKED:
          return `User has not liked any decks`
      }
    }

    return (
      <DocumentMeta title={(!profile.name ? "Loading profile" : `${profile.name}'s profile`)}>
        {profile.name == "" && <Fallback />}
        <div className="container-fluid">
          <div className="row bg-light">
            {profile.name != "" && 
              <Header {...profile} isMe={isMe} id={this.props.match.params.id} subpage={this.props.match.params.deckType} />
            }
          </div>
        </div>
        {
          profile.name != "" && decksLoading &&
            <Fallback message="The decks will be loaded soon" wholePage={false} />
        }
        {
          !decksLoading && decks.length == 0 &&
          <div className="container mt-4 text-center">
            <div className="jumbotron">
              <h1 className="display-4"><FaFrown /></h1>
              <p className="lead">{generateEmptyArrayMessage()}</p>
            </div>
          </div>
        }
        {
          !decksLoading && decks.length > 0 &&
          <div className="container py-4">
            <div className="card-columns">
              {
                decks.map(card =>
                  <Card key={card.id} card={card} />
                )
              }
            </div>
          </div>
        }
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    profile: state.currentProfileReducer
  }
})(DeckFull)