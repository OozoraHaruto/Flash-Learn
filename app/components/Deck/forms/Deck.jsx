import React from 'react';
import { Formik, Field, FieldArray } from 'formik';

import { TextField } from 'reuse'

const CardForm = ({index, arrayHelpers}) =>{
  console.log("card form", index)
  return (
    <div key={index} className="form-group mb-3">
      <div className="card w-100">
        <div className="card-header row m-0">
          <div className="mr-auto col-6 p-0 d-flex align-items-center">
            <div className="h4 m-0">
              {`Card #${index + 1}`}
            </div>
          </div>
          <div className="ml-auto col-6 p-0 text-right">
            <button type="button" className="btn btn-danger" onClick={() => arrayHelpers.remove(index)}>Delete</button>
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
}

const Deck = ({ initialValues, handleFormSubmission, dispatch = false }) => {
  const validate = values => {
    const errors = {};

    if(!values.name){
      errors['name'] = 'Required';
    }

    if(values.cards.length == 0){
      errors['cards'] = 'Required';
    }else{
      values.cards.forEach(function (item, index) {
        console.log("cards", index, item)
        if (!item.front && !item.back){
          // continue
        }


        // if(item == "") dateErrors.fieldEmpty.push((index + 1))
        // else if (!/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/i.test(item)) dateErrors.formatInvalid.push((index + 1))
        // else if (now > new Date(`${item}T23:59:59`)) dateErrors.fieldInvalid.push((index+1))
      })
    }

    // if (values.email) { // check if email is valid
    //   if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //     errors['email'] = 'Invalid email address';
    //   }
    // } else {
    //   errors['email'] = 'Required';
    // }

    // if (values.password) {
    //   if (values.password.length < 6) {
    //     errors['password'] = 'Password should be at least 6 characters'
    //   }
    // } else {
    //   errors['password'] = 'Required';
    // }

    return errors
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag, dispatch)}
        render={props => (
          <form onSubmit={props.handleSubmit}>
            <div className="container-fluid bg-light">
              <div className="row">
                <div className="container">
                  <div className="form-group row">
                    <div className="col-xl-10">
                      <Field type="text" placeholder="Deck Name" name="name" component={TextField} />
                    </div>
                    <div className="col-xl-2">
                      <button type="submit" className="btn btn-primary w-100">Add Deck</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container mt-2">
              <FieldArray name="cards" render={arrayHelpers =>(
                <div>
                  {props.values.cards && props.values.cards.length > 0 && (
                    props.values.cards.map((card, index) => (
                      <CardForm index={index} arrayHelpers={arrayHelpers} />
                    ))
                  )}
                  <div className="text-center">
                    <button type="button" className="btn btn-success" onClick={() => arrayHelpers.push('')}>Add a Card</button>
                  </div>
                </div>
              )} />
            </div>
          </form>
        )}
      />
    </React.Fragment>
  )
};

export default Deck;