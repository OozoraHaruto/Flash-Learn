import React from 'react'
import DocumentMeta from 'react-document-meta';

import { accounts } from 'actions'
import { pushToError } from 'componentConstants'

import { MiddleWrapper } from 'reuse'
import SignUpForm from 'app/components/Account/forms/Auth'

const SignUp = ({
  history,
  location,
 }) => {
  const handleUserRegistration = (values, formikBag) => {
    var { email, password } = values
    const { startAddUser }  = accounts

    return startAddUser(email, password).then(res => {
      if (!res.success) {
        if (res.code) {
          if (res.code == 'auth/email-already-in-use') {
            formikBag.setErrors({ email: res.message })
          } else {
            formikBag.setErrors({ password: res.message })
          }
        } else {
          throw res
        }
      }
    }).catch(e => {
      return pushToError(history, location, e)
    })
  }

  return (
    <DocumentMeta title="SignUp">
      <div className="container-fluid p-0">
        <MiddleWrapper boxSizing="col-xl-3 col-lg-5 col-md-7 col-9">
          <SignUpForm login={false} handleFormSubmission={handleUserRegistration} />
        </MiddleWrapper>
      </div>
    </DocumentMeta>
  )
}

export default SignUp