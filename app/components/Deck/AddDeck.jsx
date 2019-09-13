import React from 'react'
import DocumentMeta from 'react-document-meta';

import DeckForm from 'app/components/Deck/subComponents/forms/Deck'
import { decks } from 'actions'

const AddDeck = ({
  history
}) =>{
  const handleAddDeck = (values, formikBag) => {
    const { startAddDeck } = decks

    startAddDeck(values).then(res => {
      if (!res.success) {
        if (res.code) {
          formikBag.setErrors({ cards: res.message })
        } else {
          formikBag.setErrors({ cards: "Failed to add to database. Contact administrator is this problem persist" })
        }
      }else{
        return history.push({ pathname: `/deck/${res.deckId}` })
      }
    })
  }

  const createEmptyCard = () => {
    return { front: "", back: "", backSub: "" }
  }

  const createEmptyStartDeck = () =>{
    const deck = []
    for(var i = 0; i<10; i++){
      deck.push(createEmptyCard())
    }
    return deck
  }

  return (
    <DocumentMeta title="Add Deck">
      <DeckForm initialValues={{ name: "", shownPublic: true, cards: createEmptyStartDeck() }} handleFormSubmission={handleAddDeck} createEmptyCard={createEmptyCard} />
    </DocumentMeta>
  )
}

export default AddDeck;