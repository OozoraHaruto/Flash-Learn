import React from 'react'
import DocumentMeta from 'react-document-meta';

import { decks } from 'actions'
import { pushToError } from 'componentConstants'

import DeckForm from 'app/components/Deck/forms/Deck'

const AddDeck = ({
  history,
  location,
}) =>{
  const handleAddDeck = (values, formikBag) => {
    const { startAddDeck }                = decks

    return startAddDeck(values).then(res => {
      if (!res.success) {
        if (res.code) {
          formikBag.setErrors({ cards: res.message })
          formikBag.setSubmitting(false)
        } else {
          throw res
        }
      }else{
        return history.push({ pathname: `/deck/${res.deckId}` })
      }
    }).catch(e => {
      return pushToError(history, location, e)
    })
  }

  const createEmptyCard = () => {
    return { front: "", back: "", backSub: "", cardId: "", index: -1 }
  }

  const createEmptyStartDeck = () =>{
    const deck                            = []
    for(var i = 0; i<10; i++){
      deck.push(createEmptyCard())
    }
    return deck
  }

  return (
    <DocumentMeta title="Add Deck">
      <DeckForm initialValues={{ name: "", shownPublic: true, cards: createEmptyStartDeck() }} handleFormSubmission={handleAddDeck} createEmptyCard={createEmptyCard} editingDeck={false}/>
    </DocumentMeta>
  )
}

export default AddDeck;