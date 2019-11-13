import React from 'react';
import { Formik, Field } from 'formik';

import { TextField, SubmitButton } from 'reuse'

const ChangePassword = ({ initialValues, handleFormSubmission, dispatch = false }) => {
  const validate = values => {
    const errors = {};
    if (values.password) {
      if (values.password.length < 6) {
        errors['password'] = 'Password should be at least 6 characters'
      }
    } else {
      errors['password'] = 'Required';
    }

    return errors
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag, dispatch)}
    >
    {({
      handleSubmit,
      isSubmitting,
      dirty,
    }) => (
      <form onSubmit={handleSubmit}>
        <Field type="hidden" placeholder="" name="username" component={TextField} />
        <Field type="password" placeholder="Password" name="password" component={TextField} autoComplete="new-password" />
        <div className="text-center">
          <SubmitButton title="Update" {...{isSubmitting, dirty}} />
        </div>
      </form>
    )}
    </Formik>
  )
};

export default ChangePassword;