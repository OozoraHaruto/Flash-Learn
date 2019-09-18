import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
import Fallback from 'Fallback'
import Header from 'app/components/Deck/subComponents/View/Header'
import DetailsWrapper from 'app/components/Deck/subComponents/View/DetailsWrapper'
import { decks } from 'actions'

class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.match.params.id,
      isMe: false,
      details: {
        loading: true
      },
      cards: {
        loading: true
      },
      leaderboards: {
        loading: true
      },
    }
  }
  componentDidMount() {
    this.getHeaderDetails(this.props.match.params.id)
  }

  getHeaderDetails = (id) =>{
    var { getDeckDetails } = decks

    getDeckDetails(id).then(res=>{
      if(res.success){
        this.getCards(id)
        this.getLeaderboards(id)
        this.setState({
          ...this.state,
          isMe: res.data.owner.id == auth.currentUser.uid,
          details: res.data
        })
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

  getCards = (id) =>{
    var { getCards } = decks
    
    getCards(id).then(res => {
      if (res.success) {
        this.setState({
          ...this.state,
          cards: res.data
        })
      } else {
        getCards(id);
      }
    }).catch(() => {})
  }

  getLeaderboards = (id) =>{
    // TODO: Get Top 3 of all leaderboards once it is completed
  }

  deleteDeck = () =>{
    const { deleteDeck } = decks

    deleteDeck(this.props.match.params.id).then(res =>{
      if(res.success){
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
    const { isMe, details, cards, leaderboards } = this.state
    const { id } = this.props.match.params

    return (
      <DocumentMeta title={(!details.name ? "Loading deck" : details.name)}>
        {details.loading && <Fallback />}
        {!details.loading && 
          <React.Fragment>
            <Header {...details} cards={cards} deckId={id} isMe={isMe} deleteDeck={this.deleteDeck} />
            <DetailsWrapper cards={cards} leaderboards={leaderboards} />
          </React.Fragment>
        }
      </DocumentMeta>
    )
  }
}

export default connect((state) => {
  return {
    auth: state.authReducer
  }
})(View)