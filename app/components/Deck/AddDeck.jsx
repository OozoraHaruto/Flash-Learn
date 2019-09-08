import React from 'react'
import DocumentMeta from 'react-document-meta';

import DeckForm from 'app/components/Deck/forms/Deck'
// import { accounts } from 'actions'

const AddDeck = () =>{
  const handleAddDeck = (values, formikBag) => {
    // var { email, password } = values
    // const { startLoginUser } = accounts

    // startLoginUser(email, password).then(res => {
    //   if (!res.success) {
    //     if (res.code) {
    //       if (res.code == 'auth/user-not-found') {
    //         formikBag.setErrors({ email: res.message })
    //       } else {
    //         formikBag.setErrors({ password: res.message })
    //       }
    //     } else {
    //       formikBag.setErrors({ password: "Failed to sign up. Please try again later" })
    //     }
    //   }
    // })
  }

  return (
    <DocumentMeta title="Add Deck">
      <DeckForm initialValues={{ name: "", cards: [] }} handleFormSubmission={handleAddDeck} />
      
    </DocumentMeta>
  )
}

export default AddDeck;