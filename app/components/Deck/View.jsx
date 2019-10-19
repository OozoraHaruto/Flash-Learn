import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
import Fallback from 'Fallback'
import * as comConst from 'componentConstants'
import Header from 'app/components/Deck/subComponents/View/Header'
import DetailsWrapper from 'app/components/Deck/subComponents/View/DetailsWrapper'
import { decks, accounts } from 'actions'

export class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id                                    : props.match.params.id,
      isMe                                  : false,
      details: {
        loading                             : true
      }, 
      cards: {
        loading                             : true
      }, 
      leaderboards: {
        loading                             : true
      }, 
      following                             : undefined,
      followerCount                         : undefined,
    }
  }
  componentDidMount() {
    this.getHeaderDetails(this.props.match.params.id)
  }

  getHeaderDetails = (id) =>{
    var { getDeckDetails }                  = decks

    getDeckDetails(id).then(res=>{
      if (res.success) {
        const newState = {
          ...this.state,
          isMe: auth.currentUser ? (res.data.owner.id == auth.currentUser.uid) : false,
          details: res.data
        }
        this.getCards(id)
        this.getLeaderboards(id)
        this.getFollowerCount(id)
        if (!newState.isMe && auth.currentUser){
          this.getFollowingDeck(id)
        }

        this.setState(newState)
      }else{
        throw(res)
      }
    }).catch(e =>{
      if (!this.props.history.location.state){
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
      } else if (this.props.history.location.state.from == '/login') {
        return this.props.history.push({ pathname: '/' }) // TODO: Error Page
        // return this.props.history.push({ pathname: '/error', state: e })
      }else{
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
      }
    })
  }

  getCards = id =>{
    var { getCards, addDeckToRedux}         = decks
    
    getCards(id).then(res => {
      if (res.success) {
        this.setState({
          ...this.state,
          cards                             : res.data
        })
        this.props.dispatch(addDeckToRedux(id, this.state.details.name, res.data))
      } else {
        getCards(id);
      }
    }).catch(() => {})
  }

  getLeaderboards = id =>{
    const { getDeckTopLeaderboard }         = decks
    const leaderboardRequests = [
      getDeckTopLeaderboard(comConst.TEST_MCQ, id),
      getDeckTopLeaderboard(comConst.TEST_OPENENDED, id),
      getDeckTopLeaderboard(comConst.TEST_TRUEFALSE, id),
      getDeckTopLeaderboard(comConst.TEST_ULTIMATE, id),
    ]

    Promise.all(leaderboardRequests).then(res =>{
      var leaderboards                      = {}
      leaderboards[comConst.TEST_MCQ]       = res[0].success ? res[0].data : undefined
      leaderboards[comConst.TEST_OPENENDED] = res[1].success ? res[1].data : undefined
      leaderboards[comConst.TEST_TRUEFALSE] = res[2].success ? res[2].data : undefined
      leaderboards[comConst.TEST_ULTIMATE]  = res[3].success ? res[3].data : undefined
      
      this.setState({
        ...this.state,
        leaderboards
      })
    }).catch(e =>{
      console.log("error getting leaderboard", e)
    })
  }

  getFollowerCount = id =>{
    const { getFollowerCount }              = decks

    getFollowerCount(id).then(res =>{
      if(res.success){
        this.setState({
          ...this.state,
          followerCount                     : res.data
        })
      }else{
        getFollowerCount(id)
      }
    }).catch( () =>{})
  }

  getFollowingDeck = id => {
    var { checkIfUserIsSubscribedToDeck }   = accounts

    checkIfUserIsSubscribedToDeck(id).then(res=>{
      this.setState({
        ...this.state,
        following                           : res.data.exists
      })
    }).catch(e => {
      console.log(e.message)
    })
  }

  followDeck = () => {
    var { startAddSubscribedDeckRef, startDeleteSubscribedDeckRef }     = accounts
    const subscribe                       = !this.state.following

    this.setState({
      ...this.state,
      following                           : "editing"
    })

    const editFollowingState = (success) =>{
      var newState = {
        ...this.state,
        following: success ? subscribe: !subscribe
      }
      if(success){
        newState.followerCount = subscribe ? this.state.followerCount + 1 : this.state.followerCount - 1
      }
      this.setState(newState)
    }

    if (subscribe){
      const {name, owner} = this.state.details
      startAddSubscribedDeckRef(this.props.match.params.id, name, owner.id).then(res => {
        editFollowingState(res.success)
      })
    }else{
      startDeleteSubscribedDeckRef(this.props.match.params.id).then(res => {
        editFollowingState(res.success)
      })
    }
  }
  
  deleteDeck = () =>{
    const { deleteDeck, deleteReduxDeck }   = decks

    deleteDeck(this.props.match.params.id).then(res =>{
      if(res.success){
        this.props.dispatch(deleteReduxDeck())
        return this.props.history.push({ pathname: '/' })
      }else{
        // return this.props.history.push({ pathname: '/' }) // TODO: Error Page
        console.log("Failed to delete deck")
      }
    }).catch(e => {
      console.log(e.message)
    })
  }
  
  render() {
    const { 
      isMe, 
      details, 
      cards, 
      leaderboards,
      followerCount,
      following,
    }                                       = this.state
    const { id }                            = this.props.match.params

    return (
      <DocumentMeta title={(!details.name ? "Loading deck" : details.name)}>
        {details.loading && <Fallback />}
        {!details.loading && 
          <React.Fragment>
            <Header {...details} {...{cards, followerCount, following}} deckId={id} isMe={isMe} deleteDeck={this.deleteDeck} followDeck={this.followDeck}/>
            <DetailsWrapper cards={cards} leaderboards={leaderboards} />
          </React.Fragment>
        }
      </DocumentMeta>
    )
  }
}

export default connect()(View)