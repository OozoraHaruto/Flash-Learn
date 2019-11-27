import React from 'react';
import DocumentMeta from 'react-document-meta';
import queryString from 'query-string';

import { DECK_SEARCH_SORT_RELEVANCE_DESC } from 'componentConstants'
import { NormLink } from 'reuse'

import SearchForm from 'app/components/Deck/forms/Search'

export default class MainPage extends React.Component{
  handleSearch = (values, formikBag) => {
    const { query, sort }                   = values

    this.props.history.push({pathname: "/deck", search : `?${queryString.stringify({query, sort})}`})
  }

  render(){
    return(
      <DocumentMeta title="FlashLearn">
        <div className="wholePageWithNav d-flex flex-column justify-content-center align-items-center">
          <div className="display-4 text-center">Look for a deck you want</div>
          <div className="mt-2">
            <SearchForm handleFormSubmission={this.handleSearch} initialValues={{ query: "", sort: DECK_SEARCH_SORT_RELEVANCE_DESC.value }} />
          </div>
          <div className="text-center mt-2">Or create one <NormLink title="here" to="/deck/add" /> yourself</div>
        </div>
      </DocumentMeta>
    )
  }
}