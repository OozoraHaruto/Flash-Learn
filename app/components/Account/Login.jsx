import React from 'react'
import DocumentMeta from 'react-document-meta';

import { accounts } from 'actions'

import LoginForm from 'app/components/Account/forms/Auth'
import { MiddleWrapper } from 'reuse'

const Login = ({
  history,
  location,
}) =>{
  const handleUserLogin = (values, formikBag) => {
    var { email, password } = values
    const { startLoginUser } = accounts

    return startLoginUser(email, password).then(res => {
      if (!res.success) {
        if (res.code) {
          if (res.code == 'auth/user-not-found') {
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
    <DocumentMeta title="Login">
      <div className="container-fluid p-0">
        <MiddleWrapper boxSizing="col-xl-3 col-lg-5 col-md-7 col-9">
          <LoginForm login={true} handleFormSubmission={handleUserLogin} />
        </MiddleWrapper>
      </div>
    </DocumentMeta>
  )
}

export default Login;