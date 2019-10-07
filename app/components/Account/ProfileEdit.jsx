import React from 'react';
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase'
import EmailForm from 'app/components/Account/forms/ChangeEmail'
import PasswordForm from 'app/components/Account/forms/ChangePassword'

export default class ProfileEdit extends React.Component{
  render() {
    const handleChangeEmail = (values, formikBag) => {
      console.log("Edit Email")

      // TODO: implement
    }

    const handleChangePassword = (values, formikBag) => {
      console.log("Edit Email")

      // TODO: implement
    }
    
    return(
      <DocumentMeta title="Edit Profile">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Profile Picture</h5>
                  <p className="card-text">
                    We use do not hold onto any photos, we use the photo from Gravatar.<br />
                    To change your photo do head to <a href="gravatar.com" target="_parent">Gravatar's website</a>.<br />
                    Ensure the email you register with Gravatar is the same as the one used on this website.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Email</h5>
                  <EmailForm initialValues={{ email: auth.currentUser.email }} handleFormSubmission={handleChangeEmail} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Password</h5>
                  <PasswordForm handleFormSubmission={handleChangePassword} />
                </div>
              </div>
            </div>
          </div>
          {/* TODO: Email */}
          {/* TODO: password */}
          {/* TODO: photo */}
        </div>
      </DocumentMeta>
    )
  }
}