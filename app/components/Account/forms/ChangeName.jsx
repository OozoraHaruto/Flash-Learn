import React from 'react';
import { Formik, Field } from 'formik';

import { TextField, SubmitButton } from 'reuse'

const ChangeName = ({ initialValues, handleFormSubmission, dispatch = false }) => {
  const validate = values => {
    const errors = {};

    if (!values.name) {
      errors['name'] = 'Required';
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
        <Field type="text" placeholder="Name" name="name" component={TextField} />
        <div className="text-center">
          <SubmitButton title="Update" {...{isSubmitting, dirty}} />
        </div>
      </form>
    )}
    </Formik>
  )
};

export default ChangeName;