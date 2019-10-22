import React from 'react';
import { Formik, Field } from 'formik';

import { SubmitButton } from 'reuse'
import * as comConst from 'componentConstants'

const Search = ({ initialValues, handleFormSubmission, dispatch = false }) => {
  const validate = values => {
    return {}
  }

  const sortOptions = [
    comConst.DECK_SEARCH_SORT_RELEVANCE_DESC,
    comConst.DECK_SEARCH_SORT_NAME_ASC,
    comConst.DECK_SEARCH_SORT_NAME_DESC,
    comConst.DECK_SEARCH_SORT_LAST_UPDATED_ASC,
    comConst.DECK_SEARCH_SORT_LAST_UPDATED_DESC,
  ]

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag, dispatch)}
        render={({
          handleSubmit,
          isSubmitting,
          dirty,
        }) => (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <Field type="search" placeholder="Search..." name="query" className="form-control" />
                <div className="input-group-append">
                  <Field placeholder="Sort by" name="sort" component="select" className="select-no-radius">
                    {
                      sortOptions.map(option => <option key={`search_sort_${option.value}`} value={option.value}>{option.label}</option>)
                    }
                  </Field>
                  <SubmitButton title="Search" submitting={isSubmitting} dirty={dirty} />
                </div>
              </div>
            </form>
          )}
      />
    </React.Fragment>
  )
};

export default Search;