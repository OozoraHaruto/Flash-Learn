import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';
var moment = require('moment');

import * as comConst from 'componentConstants'
import { decks } from 'actions'

class TestResult extends Component {
  constructor() {
    super()

    this.state = {
      sortBy                            : comConst.TEST_RESULT_SORT_QUESTION_NUMBER.value,
    }
  }

  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    } else if (!this.props.location.state.answers) {
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    }
  }
  // formatTime = (timeFrom, timeTo) =>{
  //   const from                          = moment(timeFrom)
  //   const to                            = moment(timeTo)
  //   var hr                              = to.diff(from, 'hours')
  //   var min                             = to.diff(from, 'minutes')
  //   var sec                             = to.diff(from, 'seconds')
  //   var ms                              = to.diff(from, 'milliseconds')
  //   var textForm                        = ""

  //   if (hr != 0){
  //     textForm                          = `${textForm} ${hr} ${hr > 1 ? "hrs" : "hr"} `
  //   }
  //   if (min != 0){
  //     textForm                          = `${textForm} ${min} ${min > 1 ? "mins" : "min"} `
  //   }
  //   if (sec != 0){
  //     textForm                          = `${textForm} ${sec} ${sec > 1 ? "secs" : "sec"} `
  //   }
  //   if (ms != 0){
  //     textForm                          = `${textForm} ${ms} ms `
  //   }
  //   return textForm.trim()
  // }
  formatTime = ms =>{
    const duration                      = moment.duration(ms, 'milliseconds')
    var hr                              = duration.hours()
    var min                             = duration.minutes()
    var sec                             = duration.seconds()
    var ms                              = duration.milliseconds()
    var textForm                        = ""

    if (hr != 0){
      textForm                          = `${textForm} ${hr} ${hr > 1 ? "hrs" : "hr"} `
    }
    if (min != 0){
      textForm                          = `${textForm} ${min} ${min > 1 ? "mins" : "min"} `
    }
    if (sec != 0){
      textForm                          = `${textForm} ${sec} ${sec > 1 ? "secs" : "sec"} `
    }
    if (ms != 0){
      textForm                          = `${textForm} ${ms} ms `
    }
    return textForm.trim()
  }

  render() {
    var { sortBy }                      = this.state
    var { name, questions }             = this.props.test
    var { answers }                     = this.props.location.state
    const sortOptions                   = [
      comConst.TEST_RESULT_SORT_QUESTION_NUMBER,
    ]

    const renderTopMessage = () =>{
      if (this.props.location.state.gotWrong == 0){
        return(
          <div className="text-center d-flex wholePageWithNav justify-content-center align-items-center">
            <div className="display-1 animated bounce">
              You crushed it!!!
            </div>
          </div>
        )
      }else{
        return(
          <div className="text-center d-flex wholePageWithNav justify-content-center align-items-center">
            <div className="display-4">
              Do more practices, you will crush it the next time
            </div>
          </div>
        )
      }
    }

    const renderSummary = () => {
      const {
        totalTime,
        noOfQn,
        gotCorrect,
        gotWrong,
        longestStreak,
      }                                 = this.props.location.state

      const renderAnsweredCorrectlyText = () =>{
        if (gotWrong == 0){
          return <div>You answered all of them correctly. Good Job!</div>
        } else if (gotCorrect == 0){
          return <div>You got them all of them wrong. Do practice more. You can do it!</div>
        } else{
          return <div>You got {gotCorrect} questions correct and {gotWrong} wrong.</div>
        }
      }

      return (
        <div className="text-center d-flex flex-column wholePage justify-content-center align-items-center">
          <div className="display-4">
            Here is a short summary
          </div>
          <div>You answered {noOfQn} questions in {this.formatTime(totalTime)}</div>
          {renderAnsweredCorrectlyText()}
          <div>Your longest correct streak is {!longestStreak ? noOfQn : longestStreak }</div>
        </div>
      )
    }

    return (
      <DocumentMeta title={`${name}'s Test`}>
        {renderTopMessage()}
        {renderSummary()}

        <div>
          <div className="display-4 text-center">Here is the full details of your test</div>
          {/* TODO: Details subpage */}
        </div>
        <div className="text-center py-5 container">
          <div className="row">
            <div className="col">
              <h4 className="text-center">Here are some buttons to lead you where you want to go faster</h4>
            </div>
          </div>
          <div className="row">
            {/* TODO: Redirect */}
            <div className="col-md-6 col-lg-3 mt-2">
              <button className="btn btn-primary btn-block">Retake Test*</button>
            </div>
            <div className="col-md-6 col-lg-3 mt-2">
              <button className="btn btn-primary btn-block">Retake Test (Shuffle)*</button>
            </div>
            <div className="col-md-6 col-lg-3 mt-2">
              <button className="btn btn-primary btn-block">Test (Options page)</button>
            </div>
            <div className="col-md-6 col-lg-3 mt-2">
              <button className="btn btn-primary btn-block">Study again</button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <small>* Questions will be the same</small>
            </div>
          </div>
        </div>
        <div className="text-center d-flex flex-column wholePage justify-content-center align-items-center">
          <h3>Lastly, we would like to thank you for using this application and all the best for whatever you are studying {name} for.</h3>
        </div>
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    test                                : state.currentTestReducer,
  }
})(TestResult)