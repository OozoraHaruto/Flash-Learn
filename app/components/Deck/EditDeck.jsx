import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase';
import { decks } from 'actions'

import DeckForm from 'app/components/Deck/forms/Deck'
import { dataLoading } from 'reuse'

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
    }
  }
  componentDidMount() {
    this.getHeaderDetails(this.props.match.params.id)
  }

  getHeaderDetails = (id) => {
    var { getDeckDetails } = decks

    getDeckDetails(id).then(res => {
      if (res.success) {
        if (res.data.owner.id != auth.currentUser.uid){
          throw ({message: "Not allowed to access this deck"})
        }
        this.getCards(id)
        this.setState({
          ...this.state,
          isMe: res.data.owner.id == auth.currentUser.uid,
          details: res.data
        })
      } else {
        throw (res)
      }
    }).catch(e => {
      return this.props.history.push({ pathname: '/' }) // TODO: Error Page
    })
  }

  getCards = (id) => {
    var { getCards }                    = decks

    getCards(id).then(res => {
      if (res.success) {
        let cards = res.data.map(card =>{
          return {
            ...card.data(),
            cardId: card.id,
          }
        })
        this.setState({
          ...this.state,
          cards
        })
      } else {
        getCards(id);
      }
    }).catch(() => { })
  }

  render() {
    const { details, cards }            = this.state
    const LoadingDeckForm               = dataLoading(true, "The form should be loaded soon")(DeckForm)

    const handleEditDeck = (values, formikBag) => {
      const { editDeck }                = decks
      const { id }                      = this.props.match.params
      const toCheck                     = ["front", "back", "backSub", "index"]
      var tmpCards                      = cards.slice() // seperate cards from memory to prevent problems
      var cardsCleaned                  = [] // removed cards that have front and back empty w/o new cards
      var cardsAdded                    = []
      var cardsEdited                   = []
      var index                         = 0

      const findCard = cardId =>{
        for(var i=0; i<tmpCards.length; i++){
          if(tmpCards[i].cardId == cardId){
            return tmpCards.splice(i,1)[0]
          }
        }
      }

      values.cards.forEach(card=>{
        if(card.front.trim() != "" && card.back.trim() != ""){
          if(card.cardId == ""){
            cardsAdded.push({...card, index: index++})
          }else{
            cardsCleaned.push({...card, index: index++})
          }
        }
      })

      cardsCleaned.forEach(card =>{
        var tmpCard                     = findCard(card.cardId)
        for(var i=0; i<toCheck.length; i++){
          const key                     = toCheck[i]
          
          if(card[key] != tmpCard[key]){
            return cardsEdited.push(card)
          }
        }
      })

      editDeck(id, cardsAdded, tmpCards, cardsEdited).then(res => {
        if (!res.success) {
          if (res.code) {
            formikBag.setErrors({ cards: res.message })
          } else {
            formikBag.setErrors({ cards: "Failed to add to database. Contact administrator is this problem persist" })
          }
        }else{
          return this.props.history.push({ pathname: `/deck/${this.props.match.params.id}` })
        }
      })
    }

    const createEmptyCard = () => {
      return { front: "", back: "", backSub: "", cardId: "", index: -1 }
    }

    return (
      <DocumentMeta title={(!details.name ? "Loading deck" : details.name)}>
        <LoadingDeckForm loading={!(!details.loading && !cards.loading)} initialValues={{ name: details.name, shownPublic: details.public, cards }} handleFormSubmission={handleEditDeck} createEmptyCard={createEmptyCard} editingDeck={true}/>
      </DocumentMeta>
    )
  }
}

export default connect((state) => {
  return {
    auth: state.authReducer
  }
})(View)