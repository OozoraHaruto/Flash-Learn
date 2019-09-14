import React, { Component } from 'react'
import { connect } from 'react-redux'

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
    const { id } = this.props.match.params

    this.getHeaderDetails(id)
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
  
  render() {
    const { isMe, details, cards, leaderboards } = this.state
    const { id } = this.props.match.params

    return (
      <React.Fragment>
        {details.loading && <Fallback />}
        {!details.loading && 
          <React.Fragment>
            <Header {...details} cards={cards} deckId={id} isMe={isMe} />
            <DetailsWrapper cards={cards} leaderboards={leaderboards} />
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default connect((state) => {
  return {
    auth: state.authReducer
  }
})(View)