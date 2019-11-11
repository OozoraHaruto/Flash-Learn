import React from 'react';
import { Formik, Field, FieldArray } from 'formik';
import { 
  SortableContainer, 
  SortableElement,
  SortableHandle, 
} from 'react-sortable-hoc';
import { FaBars } from "react-icons/fa";

import { decks } from 'actions'
import { TextField, SubmitButton } from 'reuse'


const CardForm = SortableElement(({
  arrayHelpers: {remove, insert},
  createEmptyCard,
  id: index, 
}) =>(
  <div className="form-group mb-3" >
    <div className="card w-100">
      <div className="card-header row m-0">
        <div className="mr-auto col d-flex align-items-center">
          <div className="h4 m-0 d-flex align-items-center text-muted">
            <DragHandle />
          </div>
          <div className="h4 mb-0 ml-2">
              {`Card #${index + 1}`}
          </div>
        </div>
        <div className="ml-auto col text-right">
            <button type="button" className="btn btn-success mr-3" onClick={() => insert(index, createEmptyCard())}>Insert Above</button>
          <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Delete</button>
        </div>
      </div>
      <div className="card-body row">
        <div className="col-sm">
          <Field type="text" placeholder="Front" name={`cards.${index}.front`} component={TextField} />
          <Field type="hidden" placeholder="id" name={`cards.${index}.cardId`} component={TextField} />
          <Field type="hidden" placeholder="index" name={`cards.${index}.index`} component={TextField} />
        </div>
        <div className="col-sm">
          <Field type="text" placeholder="Back" name={`cards.${index}.back`} component={TextField} />
        </div>
        <div className="col-sm">
          <Field type="text" placeholder="Back (Bottom)" name={`cards.${index}.backSub`} component={TextField} />
        </div>
      </div>
    </div>
  </div>
))

const DragHandle = SortableHandle (() =>(
  <FaBars style={{ cursor: "move" }} />
))

const Deck = ({ initialValues, handleFormSubmission, dispatch = false, createEmptyCard, editingDeck }) => {
  const validate = values => {
    const errors                          = {};
    const { validateWYSIWYG }             = decks

    if(!values.name){
      errors['name']                      = 'Required';
    }

    var tmpCards                          = values.cards.filter(card =>{
      if (card.front.trim() == "" && card.back.trim() == "" && card.backSub.trim() == "") {
        return false
      }
      return true
    })

    if (tmpCards.length < 6){
      errors['cardParent']                     = 'A deck needs at least 6 cards';
    }
    if (tmpCards.length != 0){
      var cardErrors                      = []
      var haveError                       = false
      for (var i=0; i< values.cards.length; i++){
        const card                        = values.cards[i]
        var cardError                     = {}

        if (card.front.trim() == "" && card.back.trim() == "" && card.backSub.trim() == "") {
          cardErrors.push(cardError)
          continue
        }else{
          if(!card.front){
            cardError['front']            = 'Required';
          } else {
            let validation = validateWYSIWYG(card.front)
            if (validation instanceof Error){
              console.log(`${card.front} validation`, validation.message)
              cardError['front']          = validation.message;
            }
          }
          if(!card.back){
            cardError['back']             = 'Required';
          } else {
            let validation = validateWYSIWYG(card.back)
            if (validation instanceof Error) {
              console.log(`${card.back} validation`, validation.message)
              cardError['back'] = validation.message;
            }
          }
          if(card.backSub){
            let validation = validateWYSIWYG(card.backSub)
            if (validation instanceof Error) {
              console.log(`${card.backSub} validation`, validation.message)
              cardError['backSub'] = validation.message;
            }
          }
        }
        if (!jQuery.isEmptyObject(cardError)) 
          haveError                       = true
        cardErrors.push(cardError)
      }
      if(haveError) 
        errors['cards']                   = cardErrors
    }
    return errors
  }

  const DeckList = SortableContainer(({
    arrayHelpers,
    cards,
  }) => (
    <div>
      {
        cards && cards.length > 0 && (
          cards.map((card, index) =>
            <CardForm index={index} id={index} arrayHelpers={arrayHelpers} key={`card#${index}`} createEmptyCard={createEmptyCard} />)
        )
      }
    </div>
  ))

  const sortEnd = (arrayHelpers) =>({
    oldIndex, 
    newIndex,
  }) =>{
    arrayHelpers.move(oldIndex, newIndex)
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag, dispatch)}
      >{({
        handleSubmit,
        values,
        errors,
        isSubmitting,
        dirty,
      }) => (
          <form onSubmit={handleSubmit}>
            <div className="container-fluid bg-light sticky-top">
              <div className="row">
                <div className="container mt-3">
                  <div className="form-group row py-2">
                    <div className="col-xl-9">
                      <Field type="text" placeholder="Deck Name" name="name" component={TextField} />
                    </div>
                    <div className="col-xl-3">
                      <SubmitButton title={editingDeck ? "Save Deck" : "Add Deck"} className="w-100" submitting={isSubmitting} dirty={dirty} />
                      <small className="text-danger">{errors.cardParent}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FieldArray name="cards" render={arrayHelpers => (
              <div className="container mt-2">
                <DeckList cards={values.cards} useDragHandle={true} arrayHelpers={arrayHelpers} onSortEnd={sortEnd(arrayHelpers)} />
                <div className="text-center">
                  <button type="button" className="btn btn-success" onClick={() => arrayHelpers.push(createEmptyCard())}>Add a Card</button>
                </div>
              </div>
            )} />
          </form>
        )}
        </Formik>
    </React.Fragment>
  )
};

export default Deck;