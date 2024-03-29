import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
import { decks, accounts } from 'actions'
import { TEST_MCQ, TEST_OPENENDED, TEST_TRUEFALSE, TEST_ULTIMATE, pushToError } from 'componentConstants'

import DetailsWrapper from 'app/components/Deck/subComponents/View/DetailsWrapper'
import Fallback from 'Fallback'
import Header from 'app/components/Deck/subComponents/View/Header'

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
      like                                  : undefined,
      likeCount                             : undefined,
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
        this.getLikeCount(id)
        if (!newState.isMe && auth.currentUser){
          this.getLikesDeck(id)
        }

        this.setState(newState)
      }else{
        throw(res)
      }
    }).catch(e =>{
      if (!this.props.history.location.state){
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
      } else if (this.props.history.location.state.from == '/login') {
        return pushToError(this.props.history, this.props.location, e)
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
        throw res
      }
    }).catch(() => {
      this.getCards(id)
    })
  }

  getLeaderboards = id =>{
    const { getDeckTopLeaderboard }         = decks
    const leaderboardRequests = [
      getDeckTopLeaderboard(TEST_MCQ, id),
      getDeckTopLeaderboard(TEST_OPENENDED, id),
      getDeckTopLeaderboard(TEST_TRUEFALSE, id),
      getDeckTopLeaderboard(TEST_ULTIMATE, id),
    ]

    Promise.all(leaderboardRequests).then(res =>{
      var leaderboards                      = {}
      leaderboards[TEST_MCQ]                = res[0].success ? res[0].data : undefined
      leaderboards[TEST_OPENENDED]          = res[1].success ? res[1].data : undefined
      leaderboards[TEST_TRUEFALSE]          = res[2].success ? res[2].data : undefined
      leaderboards[TEST_ULTIMATE]           = res[3].success ? res[3].data : undefined
      
      this.setState({
        ...this.state,
        leaderboards
      })
    }).catch(e =>{
      this.getLeaderboards(id)
    })
  }

  getLikeCount = id =>{
    const { getLikeCount }                  = decks

    getLikeCount(id).then(res =>{
      if(res.success){
        this.setState({
          ...this.state,
          likeCount                         : res.data
        })
      }else{
        throw res
      }
    }).catch( () =>{
      this.getLikeCount(id)
    })
  }

  getLikesDeck = id => {
    var { checkIfUserLikedDeck }            = accounts

    checkIfUserLikedDeck(id).then(res=>{
      if(res.success){
        this.setState({
          ...this.state,
          like                              : res.data.exists
        })
      }else{
        throw res
      }
    }).catch(e => {
      this.getLikesDeck(id)
    })
  }

  likeDeck = () => {
    var { 
      startAddLikedDeckRef, 
      startDeleteLikedDeckRef 
    }                                       = accounts
    const like                              = !this.state.like

    const editLikesState = (success) =>{
      var newState = {
        ...this.state,
        like                                : success ? like: !like
      }
      if(success){
        newState.likeCount                  = like ? this.state.likeCount + 1 : this.state.likeCount - 1
      }
      this.setState(newState)
    }

    this.setState({
      ...this.state,
      like                                  : "editing"
    }, () =>{
      if (like) {
        const { name, owner } = this.state.details
        startAddLikedDeckRef(this.props.match.params.id, name, owner.id).then(res => {
          editLikesState(res.success)
        })
      } else {
        startDeleteLikedDeckRef(this.props.match.params.id).then(res => {
          editLikesState(res.success)
        })
      }
    })
  }
  
  deleteDeck = () =>{
    const { deleteDeck, deleteReduxDeck }   = decks

    deleteDeck(this.props.match.params.id).then(res =>{
      if(res.success){
        this.props.dispatch(deleteReduxDeck())
        return this.props.history.push({ pathname: '/' })
      }else{
        throw res
      }
    }).catch(e => {
      return pushToError(this.props.history, this.props.location, e)
    })
  }
  
  render() {
    const { 
      isMe, 
      details, 
      cards, 
      leaderboards,
      likeCount,
      like,
    }                                       = this.state
    const { id }                            = this.props.match.params

    return (
      <DocumentMeta title={(!details.name ? "Loading deck" : details.name)}>
        {details.loading && <Fallback />}
        {!details.loading && 
          <React.Fragment>
            <Header {...details} {...{cards, likeCount, like}} deckId={id} isMe={isMe} deleteDeck={this.deleteDeck} likeDeck={this.likeDeck}/>
            <DetailsWrapper cards={cards} leaderboards={leaderboards} />
          </React.Fragment>
        }
      </DocumentMeta>
    )
  }
}

export default connect()(View)