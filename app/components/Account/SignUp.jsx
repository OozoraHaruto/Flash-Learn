import React from 'react'
import DocumentMeta from 'react-document-meta';

import SignUpForm from 'app/components/Account/forms/Auth'
import { accounts } from 'actions'
import { MiddleWrapper } from 'reuse'

const SignUp = ({ dispatch }) => {
  const handleUserRegistration = (values, formikBag, dispatch) => {
    var { email, password } = values
    const { startAddUser } = accounts

    startAddUser(email, password).then(res => {
      if (!res.success) {
        if (res.code) {
          if (res.code == 'auth/email-already-in-use') {
            formikBag.setErrors({ email: res.message })
          } else {
            formikBag.setErrors({ password: res.message })
          }
        } else {
          formikBag.setErrors({ password: "Failed to sign up. Please try again later" })
        }
      }
    })
  }
  
  return (
    <DocumentMeta title="SignUp">
      <div className="container-fluid p-0">
        <MiddleWrapper boxSizing="col-xl-3 col-lg-5 col-md-7 col-9">
          <SignUpForm login={false} handleFormSubmission={handleUserRegistration} dispatch={dispatch} />
        </MiddleWrapper>
      </div>
    </DocumentMeta>
  )
}

export default SignUp