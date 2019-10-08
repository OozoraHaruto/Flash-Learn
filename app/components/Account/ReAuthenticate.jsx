import React from 'react'
import DocumentMeta from 'react-document-meta';

import LoginForm from 'app/components/Account/forms/Auth'
import { firebase, auth } from 'firebase'
import { accounts } from 'actions'
import { MiddleWrapper } from 'reuse'
import * as comConst from 'componentConstants'


const ReAuthenticate = ({
  history,
  location,
}) => {
  const handleReAuthentication = (values, formikBag) => {
    const { startReAuthentication }          = accounts

    startReAuthentication(values.email, values.password).then(res => {
      if (!res.success) {
        if (res.code) {
          formikBag.setErrors({ password: res.message })
        } else {
          formikBag.setErrors({ password: "Failed to sign up. Please try again later" })
        }
      }else{
        history.replace({ pathname: location.state.to, state: { from: comConst.PROFILE_RE_AUTH}})
      }
    })
  }

  return (
    <DocumentMeta title="Re-authentication">
      <div className="container-fluid p-0">
        <MiddleWrapper boxSizing="col-xl-3 col-lg-5 col-md-7 col-9">
          <LoginForm login={true} handleFormSubmission={handleReAuthentication} initialValues={{email:auth.currentUser.email, password:""}} />
        </MiddleWrapper>
      </div>
    </DocumentMeta>
  )
}

export default ReAuthenticate