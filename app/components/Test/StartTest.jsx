import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';

import * as comConst from 'componentConstants'

import OpenEndedAnswer from 'app/components/Test/subComponents/View/OpenEndedAnswer'
import SelectAnswer from 'app/components/Test/subComponents/View/SelectAnswer'

export default class StartTest extends Component {
  constructor(){
    super()

    this.state ={
      noOfQn                            : undefined,
      currentQuestion                   : undefined,
    }
  }

  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    }else if(!this.props.location.state.questions){
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    }

    this.setState({
      noOfQn                            : this.props.location.state.questions.length,
      timeStart                         : new Date() ,
      currentQuestion                   : 0,
      gotCorrect                        : 0,
      gotWrong                          : 0,
      currentStreak                     : 0,
      longestStreak                     : false,
      answerDetails                     : [],
      progressType                      : comConst.TEST_PROGRESS_TYPE_COMBO
    })
  }

  processAnswer = userAnswer => {
    var {
      currentQuestion,
      gotCorrect,
      gotWrong,
      currentStreak,
      longestStreak,
      answerDetails,
    }                                   = this.state
    const currentQuestionObject         = this.props.location.state.questions[currentQuestion]
    var newState = {
      answerDetails,
      currentQuestion                   : currentQuestion + 1,
    }
    newState.answerDetails.push(userAnswer)

    if (currentQuestionObject.answer == userAnswer) {
      newState.gotCorrect               = gotCorrect + 1
      newState.currentStreak            = currentStreak + 1
    } else {
      newState.gotWrong                 = gotWrong + 1
      newState.currentStreak            = 0
      if (currentStreak > longestStreak){
        newState.longestStreak          = newState.currentStreak
      }
    }

    this.setState({
      ...this.state,
      ...newState,
    })
  }

  changeProgressBar = () =>{
    var newState                        = ""
    switch(this.state.progressType){
      case comConst.TEST_PROGRESS_TYPE_COMBO: 
        newState                        = comConst.TEST_PROGRESS_TYPE_INFO
        break
      case comConst.TEST_PROGRESS_TYPE_INFO: 
        newState                        = comConst.TEST_PROGRESS_TYPE_COMBO
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
    } = this.state
    var { name, questions }             = this.props.location.state

    const renderTestOptions = question => {
      var AnswerComponent = question.type == comConst.TEST_OPENENDED ? OpenEndedAnswer : SelectAnswer

      return <AnswerComponent options={question.options} userAnswered={this.processAnswer} />
    }

    const renderProgressBar = () =>{
      const { progressType }            = this.state
      const currentQuestionPercentage   = (currentQuestion / noOfQn) * 100

      if(progressType == comConst.TEST_PROGRESS_TYPE_COMBO){
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
      }else if(progressType == comConst.TEST_PROGRESS_TYPE_INFO){
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
          noOfQn &&
            <div className="d-flex flex-column wholePageWithNav">
              <div>
                <div className="progress" onClick={() => this.changeProgressBar()}>
                  {renderProgressBar()}
                </div>
              </div>
              <div className="text-center mt-2">
                <h2>{questions[currentQuestion].question}</h2>
              </div>
              {renderTestOptions(questions[currentQuestion])}
            </div>
        }
      </DocumentMeta>
    )
  }
}