import React from 'react';
import { Formik, Field } from 'formik';

import { TextField, SubmitButton } from 'reuse'

const ChangeEmail = ({ initialValues, handleFormSubmission, dispatch = false }) => {
  const validate = values => {
    const errors = {};

    if (values.email) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors['email'] = 'Invalid email address';
      }
    } else {
      errors['email'] = 'Required';
    }

    return errors
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag).then(() => formikBag.setSubmitting(false))}
    >
    {({
      handleSubmit,
      isSubmitting,
      dirty,
    }) => (
      <form onSubmit={handleSubmit}>
        <Field type="email" placeholder="E-mail" name="email" component={TextField} autoComplete="username" />
        <div className="text-center">
          <SubmitButton title="Update" {...{isSubmitting, dirty}} />
        </div>
      </form>
    )}
    </Formik>
  )
};

export default ChangeEmail;