import React from 'react';
import { Formik, Field } from 'formik';

import { SubmitButton } from 'reuse'
import {
  DECK_SEARCH_SORT_LAST_UPDATED_ASC,
  DECK_SEARCH_SORT_LAST_UPDATED_DESC,
  DECK_SEARCH_SORT_NAME_ASC,
  DECK_SEARCH_SORT_NAME_DESC,
  DECK_SEARCH_SORT_RELEVANCE_DESC,
} from 'componentConstants'

const Search = ({ initialValues, handleFormSubmission }) => {
  const sortOptions = [
    DECK_SEARCH_SORT_LAST_UPDATED_ASC,
    DECK_SEARCH_SORT_LAST_UPDATED_DESC,
    DECK_SEARCH_SORT_NAME_ASC,
    DECK_SEARCH_SORT_NAME_DESC,
    DECK_SEARCH_SORT_RELEVANCE_DESC,
  ]

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, formikBag) => handleFormSubmission(values, formikBag)}
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