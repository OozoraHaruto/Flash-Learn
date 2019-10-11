import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import * as comConst from 'componentConstants'
import Fallback from 'Fallback'
import { decks } from 'actions'

import OpenEndedAnswer from 'app/components/Test/subComponents/View/OpenEndedAnswer'
import SelectAnswer from 'app/components/Test/subComponents/View/SelectAnswer'

class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id                                : props.match.params.id,
      loadingMessage                    : "We are getting the cards ready",
      name                              : undefined,
    }
  }

  componentDidMount() {
    if (this.props.match.params.id != this.props.deck.id) {
      this.getDeckAndCards();
    }else{
      this.setState({
        ...this.state,
        name                            : this.props.deck.name,
      })
      this.generateQuestions(this.props.deck.cards)
    }
  }

  getDeckAndCards = () => {
    const {
      getDeck,
      getCards
    } = decks
    const { id }                        = this.props.match.params

    getDeck(id).then(res => {
      if (res.success) {
        this.setState({
          ...this.state,
          name                          : res.data.name
        })
        return getCards(id)
      } else {
        throw res
      }
    }).then(res => {
      if (res.success) {
        this.generateQuestions(res.data)
      }
    }).catch(e => {
      console.log("error", e)
      if (!this.props.history.location.state) {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}`})
      } else if (this.props.history.location.state.from == '/login') {
        return this.props.history.push({ pathname: '/' }) // TODO: Error Page
        // return this.props.history.push({ pathname: '/error', state: e })
      } else {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}`})
      }
    })
  }

  generateQuestions = deck =>{
    const noOfQn                        = !this.props.match.params.noOfQn ? deck.length : this.props.match.params.noOfQn
    const typesOfQn                     = [comConst.TEST_MCQ, comConst.TEST_OPENENDED, comConst.TEST_TRUEFALSE]
    const testType                      = this.props.match.params.testType
    const isTestUltimate                = comConst.TEST_ULTIMATE == testType
    const cardDataListRows              = deck.length
    var cardDataList                    = []
    var questions                       = []

    const generateRandomNumber = max => {
      const option                      = Math.round(Math.random() * 2)
      const randomNumber                = Math.random() * (max-1)
      
      switch(option){
        case 0: return Math.floor(randomNumber)
        case 1: return Math.ceil(randomNumber)
        case 2: return Math.round(randomNumber)
      }
    }
    const addToQuestionArray = (question, answer, options, type) => {
      const shuffle = arr => arr.reduceRight((res, _, __, arr) => [...res, arr.splice(~~(Math.random() * arr.length), 1)[0]], []); //https://stackoverflow.com/a/56749849/1092339
      questions.push({
        question,
        answer,
        options: shuffle(options),
        type,
      })
    }
    const typeOfQn = () => isTestUltimate ? typesOfQn[generateRandomNumber(typesOfQn.length)] : testType
    const createMCQQuestion = card =>{
      const numberOfOptionsChoices      = [2, 4, 6]
      const numberOfOptions             = numberOfOptionsChoices[generateRandomNumber(3)]
      const front                       = generateRandomNumber(1) == 0 ? true : false
      var choices                       = [front ? card.data().back : card.data().front]

      do{
        var answerPotential             = cardDataList[generateRandomNumber(cardDataListRows)]
        var answer                      = front ? answerPotential.back : answerPotential.front

        if (!choices.includes(answer)){
          choices.push(answer)
        }
      }while(choices.length != numberOfOptions)

      addToQuestionArray(front ? card.data().front : card.data().back, choices[0], choices, comConst.TEST_MCQ)
    }
    const createOpenEndedQuestion = card =>{
      const frontQuestion               = generateRandomNumber(1) == 0 ? true : false

      if (frontQuestion){
        addToQuestionArray(card.data().front, card.data().back.toLowerCase(), [], comConst.TEST_OPENENDED)
      }else{
        addToQuestionArray(card.data().back, card.data().front.toLowerCase(), [], comConst.TEST_OPENENDED)
      }
    }
    const createTrueFalseQuestion = card =>{
      const correct                     = generateRandomNumber(1) == 0 ? true : false
      const front                       = generateRandomNumber(1) == 0 ? true : false
      const dataA                       = front ? card.data().front : card.data().back
      const dataACorrectAns             = front ? card.data().back : card.data().front
      var dataB                         = ""

      if (correct){
        dataB                           = dataACorrectAns
      }else{
        var dataBPotential              = cardDataList[generateRandomNumber(cardDataListRows)]
        dataB                           = front ? dataBPotential.back : dataBPotential.front
      }

      addToQuestionArray(`Is ${dataA} = ${dataB}?`, dataB == dataACorrectAns ? "True" : "False", ["True", "False"], comConst.TEST_TRUEFALSE)
    }
    const createQuestion = () => {
      var card                          = deck.splice(generateRandomNumber(deck.length), 1)[0]

      switch (typeOfQn()){
        case comConst.TEST_MCQ: createMCQQuestion(card); break;
        case comConst.TEST_OPENENDED: createOpenEndedQuestion(card); break;
        case comConst.TEST_TRUEFALSE: createTrueFalseQuestion(card); break;
      }
    }

    this.setState({
      ...this.state,
      loadingMessage                    : "Hold on just a little longer, we are generating the questions now.",
      noOfQn
    })

    if (comConst.TEST_OPENENDED != testType){
      cardDataList                      = deck.map(card=> {return {front: card.data().front, back: card.data().back}})
    }
    
    for (var i = 0; i < noOfQn; i++){
      createQuestion()
    }

    this.setState({
      ...this.state,
      loadingMessage                    : false,
      questions,
      timeStart                         : new Date(),
      currentQuestion                   : 0,
      gotCorrect                        : 0,
      gotWrong                          : 0,
      currentStreak                     : 0,
      longestStreak                     : false,
      answerDetails                     : [],
    })
  }

  processAnswer = userAnswer =>{
    var {
      currentQuestion,
      gotCorrect,
      gotWrong,
      currentStreak,
      longestStreak,
      answerDetails,
    }                                   = this.state

    this.setState({
      ...this.state,
      currentQuestion                   : currentQuestion + 1,
    })
  }


  render() {
    var { 
      id, 
      loadingMessage, 
      noOfQn,
      name,
      questions,
      currentQuestion,
      gotCorrect,
      gotWrong,
      currentStreak,
      longestStreak,
      answerDetails,
    }                                   = this.state

    const renderTestOptions = question =>{
      var AnswerComponent               = question.type == comConst.TEST_OPENENDED ? OpenEndedAnswer : SelectAnswer

      return <AnswerComponent options={question.options} userAnswered={this.processAnswer}/>
    }

    return (
      <DocumentMeta title={!name ? "Loading Test Options" : `${name}'s Test`}>
        {
          loadingMessage != false &&
            <Fallback message={loadingMessage} />
        }
        {
          loadingMessage == false &&
            <div className="d-flex flex-column wholePageWithNav">
              <div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${((currentQuestion) / noOfQn) * 100}%` }} role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin="1" aria-valuemax={noOfQn}></div>
                </div>
              </div>
              <div className="text-center mt-2">
                <h2>{questions[currentQuestion].question}</h2>
              </div>
              <div>
                <button className="btn btn-outline-primary" onClick={() => this.processAnswer(1)}>Next</button>
              </div>
              {renderTestOptions(questions[currentQuestion])}
            </div>
        }
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    deck                                : state.currentDeckReducer,
  }
})(View)