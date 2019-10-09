import React from 'react';
import { Formik, Field } from 'formik';

import { TextField, SubmitButton } from 'reuse'

const Auth = ({ initialValues={email:"", password:""}, login, handleFormSubmission, dispatch=false }) => {
  const validate = values => {
    const errors              = {};

    if (values.email) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors['email']       = 'Invalid email address';
      }
    }else{
      errors['email']         = 'Required';
    }

    if(values.password){
      if(values.password.length < 6){
        errors['password']    = 'Password should be at least 6 characters'
      }
    }else{
      errors['password']      = 'Required';
    }

    return errors
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag, dispatch)}
        render={({
          handleSubmit, 
          isSubmitting,
          dirty,
        }) => (
          <form onSubmit={handleSubmit}>
            <Field type={initialValues.email=="" ? 'email' : 'hidden'} placeholder="E-mail" name="email" component={TextField} autoComplete="username"/>
            <Field type="password" placeholder="Password" name="password" component={TextField} autoComplete={login ? 'current-password' : 'new-password'}/>
            <div className="text-center">
              <SubmitButton title={login ? "Login" : "Sign Up"} submitting={isSubmitting}  dirty={dirty}/>
            </div>
          </form>
        )}
      />
    </React.Fragment>
  )
};

export default Auth;