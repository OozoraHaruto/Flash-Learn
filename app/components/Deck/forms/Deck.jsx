import React from 'react';
import { Formik, Field, FieldArray, ErrorMessage, getIn } from 'formik';

import { TextField, CheckBox, SubmitButton } from 'reuse'

const CardForm = ({
  index, 
  arrayHelpers: {remove, form}
}) =>(
  <div className="form-group mb-3" >
    <div className="card w-100">
      <div className="card-header row m-0">
        <div className="mr-auto col-6 p-0 d-flex align-items-center">
          <div className="h4 m-0">
            {`Card #${index + 1}`}
          </div>
        </div>
        <div className="ml-auto col-6 p-0 text-right">
          <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Delete</button>
        </div>
      </div>
      <div className="card-body row">
        <div className="col-4">
          <Field type="text" placeholder="Front" name={`cards.${index}.front`} component={TextField} />
        </div>
        <div className="col-4">
          <Field type="text" placeholder="Back" name={`cards.${index}.back`} component={TextField} />
        </div>
        <div className="col-4">
          <Field type="text" placeholder="Back (Bottom)" name={`cards.${index}.backSub`} component={TextField} />
        </div>
      </div>
    </div>
  </div>
)

const Deck = ({ initialValues, handleFormSubmission, dispatch = false, createEmptyCard }) => {
  const validate = values => {
    const errors                          = {}; 

    if(!values.name){
      errors['name']                      = 'Required';
    }

    var tmpCards                          = values.cards.filter(card =>{
      if (card.front.trim() == "" && card.back.trim() == "") {
        return false
      }
      return true
    })

    if (tmpCards.length == 0){
      errors['cards']                     = 'Required';
    }else{
      var cardErrors                      = []
      var haveError                       = false
      for (var i=0; i< values.cards.length; i++){
        const card                        = values.cards[i]
        var cardError                     = {}

        if (card.front.trim() == "" && card.back.trim() == "") {
          continue
        }else{
          if(!card.front){
            cardError['front']            = 'Required';
          }
          if(!card.back){
            cardError['back']             = 'Required';
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

  return (
    <React.Fragment>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag, dispatch)}
        render={({
          handleSubmit, 
          values, 
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="container-fluid bg-light sticky-top">
              <div className="row">
                <div className="container mt-3">
                  <div className="form-group row py-2">
                    <div className="col-xl-10">
                      <Field type="text" placeholder="Deck Name" name="name" component={TextField} />
                    </div>
                    <div className="col-xl-2">
                      <SubmitButton title="Add Deck" className="w-100" submitting={isSubmitting} />
                      {/* TODO: Use when formik upgrade to v2 */}
                      {/* <Field type="checkbox" placeholder="Public" name="shownPublic" component={CheckBox} /> */}
                      <Field type="hidden" placeholder="Public" name="shownPublic" component={TextField} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container mt-2">
              <FieldArray name="cards" render={arrayHelpers =>(
                <React.Fragment>
                  {values.cards && values.cards.length > 0 && (
                    values.cards.map((card, index) => 
                      <CardForm index={index} arrayHelpers={arrayHelpers} key={`card#${index}`} />)
                  )}
                  <div className="text-center">
                    <button type="button" className="btn btn-success" onClick={() => arrayHelpers.push(createEmptyCard())}>Add a Card</button>
                  </div>
                </React.Fragment>
              )} />
            </div>
          </form>
        )}
      />
    </React.Fragment>
  )
};

export default Deck;