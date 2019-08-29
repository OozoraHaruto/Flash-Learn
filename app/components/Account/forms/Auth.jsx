import React from 'react';
import { Formik, Field } from 'formik';

import { TextField } from 'reuse'

const Auth = ({ login, handleFormSubmission }) => {
  const validate = values => {
    const errors              = {};

    if (values.email) { // check if email is valid
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
    <div>
      <Formik
        initialValues={{
          email               : "",
          password            : "",
        }}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag)}
        render={props => (
          <form onSubmit={props.handleSubmit}>
            <Field type="email" placeholder="E-mail" name="email" component={TextField} />
            <Field type="password" placeholder="Password" name="password" component={TextField} />
            <div className="text-center">
              <button type="submit" className="btn btn-primary">{login ? "Login" : "Sign Up"}</button>
            </div>
          </form>
        )}
      />
    </div>
  )
};

export default Auth;