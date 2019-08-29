import React from 'react';
import { Formik } from 'formik';


import TextField from 'app/components/UIReuseable/Form/TextField'

const Auth = ({ login, handleFormSubmission }) => {
  const validate = values => {
    const errors = {};

    // const requiredFields = ['email', 'password'];
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required';
      }
    })

    return errors
  }

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag)}
        render={props => (
          <form onSubmit={props.handleSubmit}>
            <TextField type="email" label="E-mail" name="email" />
            <TextField type="password" label="Password" name="password" />
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