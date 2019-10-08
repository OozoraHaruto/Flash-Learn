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
              <Field type="text" placeholder="Name" name="name" component={TextField} />
              <div className="text-center">
                <SubmitButton title="Update" submitting={isSubmitting} dirty={dirty} />
              </div>
            </form>
          )}
      />
    </React.Fragment>
  )
};

export default ChangeName;