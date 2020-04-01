import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'

import { decks } from 'actions'
const { formatAsHTMLElement } = decks
import { TEST_RESULT_SORT_QUESTION_NUMBER_ASC, TEST_RESULT_FILTER_ALL } from 'componentConstants'

import Card from 'app/components/Deck/subComponents/View/DetailsWrapper/WordList/Card'

class ResultFull extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sortBy                            : TEST_RESULT_SORT_QUESTION_NUMBER_ASC.value,
      filter                            : TEST_RESULT_FILTER_ALL.value,
      answers                           : props.getAnswerSortedBy(TEST_RESULT_SORT_QUESTION_NUMBER_ASC.value, TEST_RESULT_FILTER_ALL.value)
    }
  }
  componentDidMount(){
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
  }
  handleChangeSort = e =>{
    this.setState({
      sortBy                            : e.target.value
    }, () => this.getRefreshedData())
  }
  handleChangeFilter = e =>{
    this.setState({
      filter                            : e.target.value
    }, () => this.getRefreshedData())
  }
  getRefreshedData = () =>{
    const { getAnswerSortedBy }         = this.props
    const { sortBy, filter }            = this.state

    this.setState({
      ...this.state,
      answers                           : getAnswerSortedBy(sortBy, filter),
    })
  }
  render() {
    var { sortBy, filter, answers }     = this.state
    var {
      questions,
      sortOptions,
      filterOptions,
      deck,
    }                                   = this.props

    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col d-flex justify-content-end">
            <form className="form-inline">
              <div className="form-group">
                <select className="form-control" value={sortBy} onChange={this.handleChangeSort}>
                  {
                    sortOptions.map(option =>
                      <option value={option.value} key={`sort_${option.value}`}>{option.label}</option>
                    )
                  }
                </select>
              </div>
              <div className="form-group ml-2">
                <select className="form-control" value={filter} onChange={this.handleChangeFilter}>
                  {
                    filterOptions.map(option =>
                      <option value={option.value} key={`filer_${option.value}`}>{option.label}</option>
                    )
                  }
                </select>
              </div>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col table-responsive">
            <table className="table table-sm table-hover table-striped mt-1">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Question</th>
                  <th scope="col">Your answer</th>
                  <th scope="col" className="text-center">Correct</th>
                  <th scope="col" className="text-center">Time Taken</th>
                  <th scope="col" className="text-center">View Card</th>
                </tr>
              </thead>
              <tbody>
                {
                  answers &&
                    answers.map(answer => (
                      <tr key={`test_question_${answer.questionIndex}`}>
                        <th scope="row">{answer.questionIndex + 1}</th>
                        <td>{formatAsHTMLElement(questions[answer.questionIndex].question)}</td>
                        <td>{formatAsHTMLElement(answer.userAnswer)}</td>
                        <td className="text-center">{answer.userCorrect ? "✔︎" : `✘ (${questions[answer.questionIndex].answer})`}</td>
                        <td className="text-center">{answer.timeTakenFormatted}</td>
                        <td className="text-center">
                          <button type="button" className="btn btn-link p-0" data-toggle="popover" data-trigger="focus" data-html="true" data-content={renderToString(<Card {...deck.cards[questions[answer.questionIndex].card].data()}/>)}>View</button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>

          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    deck                                : state.currentDeckReducer,
  }
})(ResultFull)