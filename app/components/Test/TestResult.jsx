import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import * as comConst from 'componentConstants'
import { NormLink } from 'reuse'
import { accounts } from 'actions'
import Fallback from 'Fallback'

import ResultFull from 'app/components/Test/subComponents/TestResult/ResultFull'

class TestResult extends Component {
  constructor(props){
    super(props)

    this.state={
      userFastestTime                   : undefined,
      deckFastestTime                   : undefined,
      qualifyForLeaderboard             : props.location.state.gotWrong == 0 && props.test.leaderboard
    }
  }
  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    } else if (!this.props.location.state.answers) {
      return this.props.history.push(`/deck/${this.props.match.params.id}/test`)
    }
    // TODO: Get leaderboard First and compare

    if (this.props.test.leaderboard && this.state.qualifyForLeaderboard){
      this.getDeckFastest()
      this.getUserFastest()
    }
    this.updateUserPointLeaderboard()
  }

  getDeckFastest = () =>{
    const { getFastestUserTiming }      = accounts

    getFastestUserTiming(this.props.test.testType, this.props.match.params.id).then(res =>{
      this.setState({
        ...this.state,
        deckFastestTime                 : res.data
      })
    }).catch(e => {
      console.log("error getting deck fastest", e)
      this.getDeckFastest()
    })
  }
  getUserFastest = () =>{
    const { getUserFastestTiming }      = accounts

    getUserFastestTiming(this.props.test.testType, this.props.match.params.id).then(res =>{
      this.setState({
        ...this.state,
        userFastestTime                 : res.data
      }, () => this.updateUserTimingLeaderboard())
    }).catch(e => {
      console.log("error getting users' fastest", e)
      this.getUserFastest()
    })
  }

  updateUserPointLeaderboard = () =>{
    const { addPointToLeaderboard }     = accounts
    const { longestStreak, noOfQn }     = this.props.location.state

    const calculatePoints = percentage => {
      if (percentage >= 0.8) {
        return 5
      } else if (percentage >= 0.7) {
        return 4
      } else if (percentage >= 0.6) {
        return 3
      } else if (percentage >= 0.5) {
        return 2
      } else if (percentage >= 0.4) {
        return 1
      } else {
        return 0
      }
    }

    addPointToLeaderboard(calculatePoints((longestStreak / noOfQn))).then(res=>{
      if(!res.success){
        throw res
      }
    }).catch(e =>{
      console.log("error adding points", e)
    })
  }

  updateUserTimingLeaderboard = () =>{
    const {updateUserTimingLeaderboard} = accounts
    const { userFastestTime }           = this.state
    const { totalTime }                 = this.props.location.state

    if (userFastestTime > totalTime || userFastestTime == false) {
      updateUserTimingLeaderboard(this.props.test.testType, this.props.match.params.id, totalTime).then(res =>{
        if(!res.success){
          throw res
        }
      }).catch(e =>{
        console.log("error updating leaderboard", e)
      })
    }
  }

  sortAnswers = (sort, filter) => {
    if (!this.props.location.state.answers) { return undefined }
    var sortData                        = sort.split("_")
    const sortBy = (key, a, b) =>{
      if(a[key] < b[key]){
        return -1
      } else if (a[key] > b[key]){
        return 1
      } else {
        return 0
      }
    }
    var tmpAnswers = this.props.location.state.answers.filter(answer =>{
      switch(filter){
        case comConst.TEST_RESULT_FILTER_ALL.value:
          return true
        case comConst.TEST_RESULT_FILTER_CORRECT.value:
          return answer.userCorrect == true
        case comConst.TEST_RESULT_FILTER_WRONG.value:
          return answer.userCorrect == false
      }
    })
    tmpAnswers = tmpAnswers.sort((a, b) =>{
      switch (sortData[0]) {
        case comConst.TEST_RESULT_SORT_QUESTION_NUMBER.value:
          return sortBy("questionIndex", a, b)
        case comConst.TEST_RESULT_SORT_TIME_TAKEN.value:
          return sortBy("timeTaken", a, b)
      }
    })
    
    if (sortData.length == 2){
      if (sortData[1] == comConst.TEST_RESULT_SORT.desc){
        tmpAnswers                      = tmpAnswers.reverse()
      }
    }

    return tmpAnswers
  }

  render() {
    const { 
      userFastestTime, 
      deckFastestTime,
      qualifyForLeaderboard,
    }                                   = this.state
    const { 
      name, 
      questions,
    }                                   = this.props.test
    const { id }                        = this.props.match.params
    const sortOptions                   = [
      comConst.TEST_RESULT_SORT_QUESTION_NUMBER_ASC,
      comConst.TEST_RESULT_SORT_QUESTION_NUMBER_DESC,
      comConst.TEST_RESULT_SORT_TIME_TAKEN_ASC,
      comConst.TEST_RESULT_SORT_TIME_TAKEN_DESC,
    ]
    const filterOptions                 = [
      comConst.TEST_RESULT_FILTER_ALL,
      comConst.TEST_RESULT_FILTER_CORRECT,
      comConst.TEST_RESULT_FILTER_WRONG,
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

      const renderOwnComparison = () =>{
        const { userFastestTime }       = this.state
        if (userFastestTime != false){
          if (userFastestTime > totalTime){
            return <div>You broke your own record by {comConst.formatTime((userFastestTime - totalTime))}</div>
          } else if (userFastestTime < totalTime) {
            return <div>You behind your own record by {comConst.formatTime((totalTime - userFastestTime))}</div>
          }
        }
      }

      const renderFastestUserComparison = () =>{
        const { 
          deckFastestTime,
          userFastestTime,
        }                               = this.state

        if (deckFastestTime != false){
          if (deckFastestTime == userFastestTime){
            return <div>You are currently the 1<sup>st</sup> on the leaderboard</div>
          }else if (deckFastestTime > totalTime){
            return <div>You broke the record! You now hold the 1<sup>st</sup> place for the leaderboard! Congratulations!!! ٩(๑′∀ ‵๑)۶•*¨*•.¸¸♪</div>
          } else if (deckFastestTime < totalTime) {
            return <div>You behind the person that holds the first place by {comConst.formatTime((totalTime - deckFastestTime))}</div>
          }
        }else{
          return <div>You broke the record! You now hold the 1<sup>st</sup> place for the leaderboard! Congratulations!!! ٩(๑′∀ ‵๑)۶•*¨*•.¸¸♪</div>
        }
      }

      return (
        <div className="text-center d-flex flex-column wholePage justify-content-center align-items-center">
          <div className="display-4">
            Here is a short summary
          </div>
          <div>You answered {noOfQn} questions in {comConst.formatTime(totalTime)}</div>
          {qualifyForLeaderboard && renderOwnComparison()}
          {qualifyForLeaderboard && renderFastestUserComparison()}
          {renderAnsweredCorrectlyText()}
          { (gotCorrect != 0 && gotWrong != 0) && <div>Your longest correct streak is {longestStreak}</div>}
        </div>
      )
    }

    return (
      <DocumentMeta title={`${name}'s Test`}>
        {
          (qualifyForLeaderboard && (userFastestTime == undefined || deckFastestTime == undefined)) &&
            <Fallback message="We are processing as fast as we can to get your results processed" />
        }
        {
          ((qualifyForLeaderboard && (userFastestTime != undefined && deckFastestTime != undefined)) || !qualifyForLeaderboard) &&
            <React.Fragment>
              {renderTopMessage()}
              {renderSummary()}
              <div className="py-5 d-flex flex-column wholePage justify-content-center align-items-center text-center">
                <div className="display-4">Here is the full details of your test</div>
                <ResultFull {...{ questions, sortOptions, filterOptions }} getAnswerSortedBy={this.sortAnswers} />
              </div>
              <div className="text-center py-5 d-flex flex-column wholePage justify-content-center align-items-center">
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <h4 className="text-center">Here are some buttons to lead you where you want to go faster</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-lg-3 mt-2">
                      <NormLink className="btn btn-primary btn-block" title="Retake Test*" to={`/deck/${id}/test/start`} />
                    </div>
                    <div className="col-md-6 col-lg-3 mt-2">
                      <NormLink className="btn btn-primary btn-block" title="Retake Test (Shuffle)*" to={{
                        pathname: `/deck/${id}/test/start`,
                        search: "?shuffle=true",
                      }} />
                    </div>
                    <div className="col-md-6 col-lg-3 mt-2">
                      <NormLink className="btn btn-primary btn-block" title="Test (Options page)" to={`/deck/${id}/test`} />
                    </div>
                    <div className="col-md-6 col-lg-3 mt-2">
                      <NormLink className="btn btn-primary btn-block" title="Study again" to={`/deck/${id}/flashcards`} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <small>* Questions will be the same</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center d-flex flex-column wholePage justify-content-center align-items-center">
                <h3>Lastly, we would like to thank you for using this application and all the best for whatever you are studying {name} for.</h3>
              </div>
            </React.Fragment>
        }
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    test                                : state.currentTestReducer,
  }
})(TestResult)