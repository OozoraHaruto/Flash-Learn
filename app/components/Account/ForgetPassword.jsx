import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';

import { accounts } from 'actions'

import EmailForm from 'app/components/Account/forms/EmailOnly'
import { MiddleWrapper } from 'reuse'

export default class ForgetPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailSent                                 : false,
    }
  }

  render() {
    const {emailSent}                           = this.state

    const handleForgetPassword = (values, formikBag) => {
      console.log("sending email")
      const { startSendPasswordResetEmail }     = accounts
      var { email }                             = values

      return startSendPasswordResetEmail(email).then(res => {
        if (!res.success) {
          throw res
        }
        this.setState({
          ...this.state,
          emailSent                             : true
        })
      }).catch(e => {
        return pushToError(this.props.history, this.props.location, e)
      })
    }

    return (
      <DocumentMeta title="Forgot Password">
        <div className="container-fluid p-0">
          <MiddleWrapper boxSizing="col-xl-3 col-lg-5 col-md-7 col-9">
            {
              !emailSent &&
                <EmailForm initialValues={{ email: "" }} handleFormSubmission={handleForgetPassword} title="Send me the email" />
            }
            {
              emailSent &&
                <div className="text-center">
                  <h5>An email has been have been sent if you have an account with us</h5>
                  <p className="my-0">Do check your junk mail if it is not in your inbox</p>
                </div>
            }
          </MiddleWrapper>
        </div>
      </DocumentMeta>
    )
  }
}