import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';

import SignUpForm from 'app/components/Account/forms/Auth'
import { accounts } from 'actions'

export default class SignUp extends Component {
  handleUserRegistration = (values, formikBag) => {
    var { email, password }     = values
    const { startAddUser }      = accounts

    startAddUser(email, password).then(res => {
      console.log(res)
      if (!res.success) {
        if(res.code){
          formikBag.setErrors({ password: res.message })
        }else{
          formikBag.setErrors({ password: "Failed to login. Please try again later" })
        }
      }
    })
  }

  render() {
    var meta = {
      title: "SignUp"
    }

    return (
      <DocumentMeta {...meta}>
        <div className="container mt-3">
          <SignUpForm login={false} handleFormSubmission={this.handleUserRegistration} />
        </div>
      </DocumentMeta>
    )
  }
}
