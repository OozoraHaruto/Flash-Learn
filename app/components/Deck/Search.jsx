import React, { Component } from 'react'
import queryString from 'query-string';
import DocumentMeta from 'react-document-meta';

import SearchForm from 'app/components/Deck/forms/Search'
import ResultsWrapper from 'app/components/Deck/subComponents/Search/ResultsWrapper'
import * as comConst from 'componentConstants'
import { decks } from 'actions'

import { dataLoading } from 'reuse'

export default class Search extends Component {
  constructor(props){
    super(props)
    const query                             = queryString.parse(props.location.search)
    const checkForQueryString               = (key, byDefault = "") => query[key] ? query[key] : byDefault

    this.state = {
      query                                 : checkForQueryString("query"),
      sort                                  : checkForQueryString("sort", comConst.DECK_SEARCH_SORT_NAME_ASC.value),
      results                               : [],
      users                                 : {},
      loading                               : true,
    }
  }

  componentDidMount = () => this.newSearch(this.state.query, this.state.sort)

  handleSearch = (values, formikBag) => {
    this.setState({
      ...this.state,
      loading                               : true
    })
    if (values.query == this.state.query){
      const sortBy                          = values.sort.split("_")

      this.setState({
        ...this.state,
        sort                                : values.sort,
        results                             : this.sortResults(this.state.results, sortBy[0], sortBy[1] == comConst.BASIC_SORT.asc),
        loading                             : false
      }, () => {
        formikBag.setSubmitting(false)
        this.changeURL()
      })
    }else{
      this.newSearch(values.query, values.sort).then(() => {
        formikBag.setSubmitting(false)
      })
    }
  }

  newSearch = (query, sort) =>{
    const { searchForDeck }                 = decks
    const sortBy                            = sort.split("_")

    return searchForDeck(query).then(res => {
      if(res.success){
        this.setState({
          query,
          sort,
          results                           : this.sortResults(res.decks, sortBy[0], sortBy[1] == comConst.BASIC_SORT.asc),
          users                             : res.users,
          loading                           : false
        }, () => this.changeURL())
      }else{
        throw res
      }
    }).catch(e =>{
      console.log("newSearch", e)
      this.newSearch(query, sort)
    })
  }



  sortResults = (results, by, asc) => {
    if (results.length == 0) { return [] }
    let tmpResults                          = results.slice(0)

    if (by != comConst.DECK_SEARCH_SORT_NAME.value) {
      tmpResults                            = this.sortResults(tmpResults, comConst.DECK_SEARCH_SORT_NAME.value, asc)
    }
    tmpResults = tmpResults.sort(((a, b) => {
      if (a[by] < b[by]) {
        return -1
      } else if (a[by] > b[by]) {
        return 1
      } else {
        return 0
      }
    }))
    if (!asc) {
      tmpResults                            = tmpResults.reverse()
    }
    return tmpResults
  }

  changeURL = () =>{
    const { query, sort }                   = this.state

    window.history.pushState({}, `Results for ${query}`, `?${queryString.stringify({ query, sort })}`)
  }

  render(){
    var { 
      query, 
      sort,
      results, 
      users,
      loading,
    }                                       = this.state
    var { query, sort }                     = this.state
    const LoadingDecks                      = dataLoading(false, "Hold on while we search for the deck")(ResultsWrapper)

    return(
      <DocumentMeta title={`Results for ${query}`}>
        <div className="container">
          <div className="row mt-4">
            <div className="col">
              <SearchForm handleFormSubmission={this.handleSearch} initialValues={{query, sort}} />
            </div>
          </div>
          <LoadingDecks loading={loading} decks={results} users={users} />
        </div>
      </DocumentMeta>
    )
  }
}