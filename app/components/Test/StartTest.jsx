import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';
var moment = require('moment');
import queryString from 'query-string';

import {
  formatTime,
  TEST_OPENENDED,
  TEST_PROGRESS_TYPE_COMBO,
  TEST_PROGRESS_TYPE_INFO,
} from 'componentConstants'
import { decks } from 'actions'
const { formatAsHTMLElement } = decks

import OpenEndedAnswer from 'app/components/Test/subComponents/StartTest/OpenEndedAnswer'
import SelectAnswer from 'app/components/Test/subComponents/StartTest/SelectAnswer'

class StartTest extends Component {
  constructor(){
    super()

    this.state ={
      noOfQn                            : undefined,
      currentQuestion                   : undefined,
    }
  }

  componentDidMount() {
    if (jQuery.isEmptyObject(this.props.test)) {
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    } else if (!this.props.test.id == this.props.match.params.id){
      const { deleteReduxTest }         = decks
      this.props.dispatch(deleteReduxTest())
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    }

    var query                           = queryString.parse(this.props.location.search)

    if (query.shuffle){
      const {shuffleQuestionsReduxTest} = decks
      this.props.dispatch(shuffleQuestionsReduxTest())
    }

    this.setState({
      noOfQn                            : this.props.test.questions.length,
      totalTime                         : 0,
      questionTimeStart                 : new Date(),
      currentQuestion                   : 0,
      gotCorrect                        : 0,
      gotWrong                          : 0,
      currentStreak                     : 0,
      longestStreak                     : false,
      answerDetails                     : [],
      progressType                      : TEST_PROGRESS_TYPE_COMBO
    })
  }

  processAnswer = userAnswer => {
    var {
      noOfQn,
      totalTime,
      questionTimeStart,
      currentQuestion,
      gotCorrect,
      gotWrong,
      currentStreak,
      longestStreak,
      answerDetails,
    }                                   = this.state
    const currentQuestionObject         = this.props.test.questions[currentQuestion]
    const userCorrect                   = currentQuestionObject.answer == userAnswer
    const timeTaken                     = moment().diff(moment(questionTimeStart), 'milliseconds')
    var newState = {
      answerDetails,
      currentQuestion                   : currentQuestion + 1,
      totalTime                         : (totalTime + timeTaken)
    }
    newState.answerDetails.push({
      userAnswer,
      userCorrect,
      questionIndex                     : currentQuestion,
      timeTaken,
      timeTakenFormatted                : formatTime(timeTaken)
    })
    if (currentQuestionObject.answer == userAnswer) {
      newState.gotCorrect               = gotCorrect + 1
      newState.currentStreak            = currentStreak + 1
      if (newState.currentStreak > longestStreak){
        newState.longestStreak          = newState.currentStreak
      }
    } else {
      newState.gotWrong                 = gotWrong + 1
      newState.currentStreak            = 0
    }

    this.setState({
      ...this.state,
      ...newState,
      questionTimeStart                 : new Date(),
    }, () =>{
      if (newState.currentQuestion == noOfQn){
        this.finalizeResults()
      }
    })
  }

  finalizeResults = () =>{
    var {
      noOfQn,
      totalTime,
      gotCorrect,
      gotWrong,
      longestStreak,
      answerDetails,
    }                                   = this.state
    console.log("Error in finalizing", {
      noOfQn,
      gotCorrect,
      gotWrong,
      longestStreak,
      totalTime,
      answers: answerDetails,
    });
    this.props.history.replace({
      pathname                          : `/deck/${this.props.test.id}/test/results`,
      state: {
        noOfQn,
        gotCorrect,
        gotWrong,
        longestStreak,
        totalTime,
        answers                         : answerDetails,
      }
    })
  }

  changeProgressBar = () =>{
    var newState                        = ""
    switch(this.state.progressType){
      case TEST_PROGRESS_TYPE_COMBO:
        newState                        = TEST_PROGRESS_TYPE_INFO
        break
      case TEST_PROGRESS_TYPE_INFO:
        newState                        = TEST_PROGRESS_TYPE_COMBO
        break
    }

    this.setState({
      ...this.state,
      progressType                      : newState
    })
  }

  render() {
    var {
      noOfQn,
      currentQuestion,
    }                                   = this.state
    var { name, questions }             = this.props.test

    const renderTestOptions = question => {
      var AnswerComponent = question.type == TEST_OPENENDED ? OpenEndedAnswer : SelectAnswer

      return <AnswerComponent options={question.options} userAnswered={this.processAnswer} />
    }

    const renderProgressBar = () =>{
      const { progressType }            = this.state
      const currentQuestionPercentage   = (currentQuestion / noOfQn) * 100

      if(progressType == TEST_PROGRESS_TYPE_COMBO){
        const { currentStreak }          = this.state
        const getComboColor = percentage =>{
          if (percentage >= 80){
            return 'bg-success'
          }else if (percentage >= 70){
            return 'bg-info'
          }else if (percentage >= 60){
            return 'bg-primary'
          }else if (percentage >= 50){
            return 'bg-warning'
          }else{
            return 'bg-danger'
          }
        }

        return(
          <div className={`progress-bar ${getComboColor((currentStreak / currentQuestion) * 100)}`} style={{ width: `${currentQuestionPercentage}%` }} role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin="1" aria-valuemax={noOfQn}></div>
        )
      }else if(progressType == TEST_PROGRESS_TYPE_INFO){
        const { gotCorrect, gotWrong }  = this.state
        const calculatePercentage = amount => (amount / currentQuestion) * currentQuestionPercentage

        return(
          <React.Fragment>
            <div className="progress-bar bg-success" style={{ width: `${calculatePercentage(gotCorrect)}%` }} role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin="1" aria-valuemax={noOfQn}>{gotCorrect > 0 && gotCorrect}</div>
            <div className="progress-bar bg-danger" style={{ width: `${calculatePercentage(gotWrong)}%` }} role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin="1" aria-valuemax={noOfQn}>{gotWrong > 0 && gotWrong}</div>
          </React.Fragment>
        )
      }
    }

    return (
      <DocumentMeta title={`${name}'s Test`}>
        {
          (currentQuestion != noOfQn) &&
            <div className="d-flex flex-column wholePageWithNav">
              <div>
                <div className="progress" onClick={() => this.changeProgressBar()}>
                  {renderProgressBar()}
                </div>
              </div>
              <div className="text-center mt-2">
              <h2>{formatAsHTMLElement(questions[currentQuestion].question)}</h2>
              </div>
              {renderTestOptions(questions[currentQuestion])}
            </div>
        }
        {
          (currentQuestion == noOfQn && Number.isInteger(noOfQn)) &&
            <div className="d-flex flex-column wholePageWithNav justify-content-center align-items-center">
              <div className="text-center mt-2">
                <h2>We are crunching your results</h2>
                <p>Please give us a moment</p>
              </div>
            </div>
        }
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    test                                : state.currentTestReducer,
  }
})(StartTest)