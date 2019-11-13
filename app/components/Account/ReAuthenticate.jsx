import React from 'react'
import DocumentMeta from 'react-document-meta';

import { accounts } from 'actions'
import { auth } from 'firebase'
import { PROFILE_RE_AUTH, pushToError } from 'componentConstants'

import { MiddleWrapper } from 'reuse'
import LoginForm from 'app/components/Account/forms/Auth'


const ReAuthenticate = ({
  history,
  location,
}) => {
  const handleReAuthentication = (values, formikBag) => {
    const { startReAuthentication }          = accounts

    return startReAuthentication(values.email, values.password).then(res => {
      if (!res.success) {
        if (res.code) {
          formikBag.setErrors({ password: res.message })
        } else {
          throw res
        }
      }else{
        history.replace({ pathname: !location.state.to ? "/profile/edit" : location.state.to, state: { from: PROFILE_RE_AUTH}})
      }
    }).catch(e => {
      return pushToError(history, location, e)
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