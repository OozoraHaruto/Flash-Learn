import React from 'react';
import { Formik, Field } from 'formik';

import { TextField, SubmitButton } from 'reuse'

const ChangeEmail = ({ initialValues, handleFormSubmission, dispatch = false }) => {
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
              <Field type="email" placeholder="E-mail" name="email" component={TextField} autoComplete="username" />
              <div className="text-center">
                <SubmitButton title="Update" submitting={isSubmitting} dirty={dirty} />
              </div>
            </form>
          )}
      />
    </React.Fragment>
  )
};

export default ChangeEmail;