import React from 'react';
import DocumentMeta from 'react-document-meta';

import { auth } from 'firebase'
import * as comConst from 'componentConstants'
import { accounts } from 'actions';
import NameForm from 'app/components/Account/forms/ChangeName'
import EmailForm from 'app/components/Account/forms/ChangeEmail'
import PasswordForm from 'app/components/Account/forms/ChangePassword'

export default class ProfileEdit extends React.Component{
  constructor(){
    super()

    this.state = {
      nameChanged                     : undefined,
      emailChanged                    : undefined,
      passwordChanged                 : undefined,
    }
  }

  componentDidMount(){
    if(this.props.location.state.from != comConst.PROFILE_RE_AUTH){
      this.props.history.replace({ pathname: "/reauth", state: { to: '/profile/edit' }})
    }
  }

  render() {
    const { 
      nameChanged,
      emailChanged, 
      passwordChanged 
    }                                 = this.state

    const handleChangeName = (values, formikBag) => {
      var status                      = false
      const { startEditUserName }     = accounts

      startEditUserName(values.name).then(res =>{
        status                        = res.success
        this.setState({
          ...this.state,
          nameChanged: status
        })
        if (!res.success){
          throw res
        }
      }).catch(e =>{
        formikBag.setErrors({ name: e.message ? e.message : "Failed to change your name. Please try again later" })
        formikBag.setSubmitting(false)
      })
    }
    const handleChangeEmail = (values, formikBag) => {
      var status                      = false
      const { startEditUserEmail }    = accounts

      startEditUserEmail(values.email).then(res =>{
        status                        = res.success
        this.setState({
          ...this.state,
          emailChanged                  : status
        })
        if (!res.success){
          throw res
        }
      }).catch(e =>{
        formikBag.setErrors({ email: e.message ? e.message : "Failed to change your email. Please try again later" })
        formikBag.setSubmitting(false)
      })
    }

    const handleChangePassword = (values, formikBag) => {
      var status                      = false
      const { startEditUserPassword } = accounts

      startEditUserPassword(values.password).then(res =>{
        status                        = res.success
        this.setState({
          ...this.state,
          passwordChanged             : status
        })
        if (!res.success) {
          throw res
        }
      }).catch(e =>{
        formikBag.setErrors({ password: e.message ? e.message : "Failed to change your password. Please try again later" })
        formikBag.setSubmitting(false)
      })
    }

    const renderCardDetails = (type, status) =>{
      if (status == true){
        return <p className="card-text">Your {type} has been update successfully.</p>
      }else{
        switch (type) {
          case "name":
            return <NameForm initialValues={{ name: auth.currentUser.displayName }} handleFormSubmission={handleChangeName} />
          case "email":
            return <EmailForm initialValues={{ email: auth.currentUser.email }} handleFormSubmission={handleChangeEmail} />
          case "password":
            return <PasswordForm initialValues={{ username: auth.currentUser.email, password: ""}} handleFormSubmission={handleChangePassword} />
        }
      }
    }

    const cardColor = status =>{
      switch(status){
        case true:
          return "text-white bg-success"
        case false:
          return "border-danger"
        default:
          return ""
      }
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
            <div className="col-md-6 col-lg-4">
              <div className={`card mt-4 ${cardColor(nameChanged)}`}>
                <div className="card-body">
                  <h5 className="card-title">Name</h5>
                  {renderCardDetails('name', nameChanged)}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className={`card mt-4 ${cardColor(emailChanged)}`}>
                <div className="card-body">
                  <h5 className="card-title">Email</h5>
                  {renderCardDetails('email', emailChanged)}
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4">
              <div className={`card mt-4 ${cardColor(passwordChanged)}`}>
                <div className="card-body">
                  <h5 className="card-title">Password</h5>
                  {renderCardDetails('password', passwordChanged)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentMeta>
    )
  }
}