import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import Fallback from 'Fallback'
import { NormLink } from 'reuse'
import { decks } from 'actions'

import Flashcards from 'app/components/Deck/subComponents/FlashcardCarousel'

class Flashcard extends Component {
  componentDidMount() {
    if (this.props.match.params.id != this.props.deck.id) {
      this.getDeckAndCards();
    }
  }

  getDeckAndCards = () => {
    const {
      getDeck,
      getCards,
      addDeckToRedux,
    }                                   = decks
    const { id }                        = this.props.match.params
    var name                            = ""

    getDeck(id).then(res => {
      if (res.success) {
        name                            = res.data.name
        return getCards(id)
      } else {
        throw res
      }
    }).then(res => {
      if (res.success) {
        this.props.dispatch(addDeckToRedux(id, name, res.data))
      }
    }).catch(e => {
      console.log("error", e)
      if (!this.props.history.location.state) {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}`})
      } else if (this.props.history.location.state.from == '/login') {
        return this.props.history.push({ pathname: '/' }) // TODO: Error Page
        // return this.props.history.push({ pathname: '/error', state: e })
      } else {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}`})
      }
    })
  }

  render() {
    var { id, name, cards }              = this.props.deck

    return (
      <DocumentMeta title={!name ? "Loading Flashcards" : `${name}'s Flashcards`}>
        {
          this.props.match.params.id != id &&
            <Fallback message="We are loading the cards right now." />
        }
        {
          this.props.match.params.id == id &&
            <div className="wholePageWithNav d-flex flex-column p-0">
              <div className="container-fluid bg-light">
                <div className="row">
                  <div className="container">
                    <div className="row py-3">
                      <div className="col text-sm-center text-md-left text-sm-left text-center">
                        <NormLink to={`/deck/${id}`} title={name} className="h3 text-body"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 p-2 d-flex">
                <Flashcards cards={cards} />
              </div>
            </div>
        }
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    deck: state.currentDeckReducer,
  }
})(Flashcard)