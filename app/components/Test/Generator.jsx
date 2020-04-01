import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';
const { Random, MersenneTwister19937 } = require("random-js");
const random = new Random(MersenneTwister19937.autoSeed());

import { decks } from 'actions'
import { TEST_MCQ, TEST_OPENENDED, TEST_TRUEFALSE, TEST_ULTIMATE, pushToError } from 'componentConstants'

import Fallback from 'Fallback'
import Flashcards from 'app/components/Deck/subComponents/FlashcardCarousel'

class Generator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingMessage                    : "We are getting the cards ready",
    }
  }

  componentDidMount() {
    if (this.props.match.params.id != this.props.deck.id) {
      this.getDeckAndCards();
    }else{
      this.generateQuestions()
    }
  }

  getDeckAndCards = () => {
    const {
      getDeck,
      getCards,
      addDeckToRedux,
    } = decks
    const { id }                        = this.props.match.params
    var name                            = ""

    getDeck(id).then(res => {
      if (res.success) {
        name                            = res.data.name
        return getCards(id)
      } else {
        throw res
      }
    }).then(res => {
      if (res.success) {
        this.props.dispatch(addDeckToRedux(id, name, res.data))
        this.generateQuestions()
      } else {
        throw res
      }
    }).catch(e => {
      if (!this.props.history.location.state) {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}`})
      } else if (this.props.history.location.state.from == '/login') {
        return pushToError(this.props.history, this.props.location, e)
      } else {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}`})
      }
    })
  }

  getNoOfQuestions = deckLength =>{
    let length                          = Number(!this.props.match.params.noOfQn ? deckLength : this.props.match.params.noOfQn)
    if(Number.isInteger(length)){
      return length
    }else{
      return "Number of questions is not a number"
    }
  }

  getTypeOfQuestions = () =>{
    let testType                        = this.props.match.params.testType.split("-")
    let questionTypes                   = [TEST_MCQ, TEST_OPENENDED, TEST_TRUEFALSE]

    if (testType[0] == TEST_ULTIMATE){
      return questionTypes
    }else{
      testType                          = testType.reduce((result, type) =>{
        if (questionTypes.includes(type)){
          result.push(type)
        }
        return result
      }, [])

      console.log(testType)

      if (testType.length == 0){
        return "List of question types are incorrect"
      }else{
        return testType
      }
    }
  }

  generateQuestions = () =>{
    var deck                            = this.props.deck.cards.slice(0)
    const noOfQn                        = this.getNoOfQuestions(deck.length)
    const typesOfQn                     = this.getTypeOfQuestions()
    const { addTestToRedux }            = decks
    var cardDataList                    = []
    var questions                       = []

    if (isNaN(noOfQn) || !Array.isArray(typesOfQn)){
      return pushToError(this.props.history, this.props.location, {message : typeof noOfQn == 'string' ? noOfQn : typesOfQn})
    }

    const generateRandomNumber = max => random.integer(0, (max - 1))
    const addToQuestionArray = (question, answer, options, type, card) => {
      questions.push({
        question,
        answer,
        options,
        type,
        card                            : card.data().index
      })
    }
    const createMCQQuestion = card =>{
      const numberOfOptionsChoices      = [2, 4, 6]
      const numberOfOptions             = random.pick(numberOfOptionsChoices)
      const front                       = random.bool()
      var choices                       = [front ? card.data().back : card.data().front]

      do{
        var answerPotential             = random.pick(cardDataList)
        var answer                      = front ? answerPotential.back : answerPotential.front

        if (!choices.includes(answer)){
          choices.push(answer)
        }
      }while(choices.length != numberOfOptions)

      addToQuestionArray(front ? card.data().front : card.data().back, choices[0], random.shuffle(choices), TEST_MCQ, card)
    }
    const createOpenEndedQuestion = card =>{
      if (random.bool()){
        addToQuestionArray(card.data().front, card.data().backAnswers, [], TEST_OPENENDED, card)
      }else{
        addToQuestionArray(card.data().back, card.data().frontAnswers, [], TEST_OPENENDED, card)
      }
    }
    const createTrueFalseQuestion = card =>{
      const correct                     = random.bool()
      const front                       = random.bool()
      const dataA                       = front ? card.data().front : card.data().back
      const dataACorrectAns             = front ? card.data().back : card.data().front
      var dataB                         = dataACorrectAns

      if (!correct){
        dataB                           = front ? random.pick(cardDataList).back : random.pick(cardDataList).front
      }

      addToQuestionArray(`Is ${dataA} = ${dataB}?`, dataB == dataACorrectAns ? "True" : "False", ["True", "False"], TEST_TRUEFALSE, card)
    }
    const createQuestion = () => {
      var card                          = deck.splice(generateRandomNumber(deck.length), 1)[0]

      switch (typesOfQn[generateRandomNumber(typesOfQn.length)]){
        case TEST_MCQ: createMCQQuestion(card); break;
        case TEST_OPENENDED: createOpenEndedQuestion(card); break;
        case TEST_TRUEFALSE: createTrueFalseQuestion(card); break;
      }
    }

    this.setState({
      ...this.state,
      loadingMessage                    : "Hold on just a little longer, we are generating the questions now.",
    })

    if (!(typesOfQn.length == 1 && typesOfQn[0] == TEST_OPENENDED)){
      cardDataList                      = deck.map(card=> {return {front: card.data().front, back: card.data().back}})
    }

    do{
      if (deck.length == 0) {
        deck                            = this.props.deck.cards.slice(0)
      }
      createQuestion()
    }while (noOfQn != questions.length)

    this.props.dispatch(addTestToRedux(this.props.deck.id, typesOfQn.length == 3 ? TEST_ULTIMATE : typesOfQn.join("-"), this.props.deck.name, questions, ((typesOfQn.length == 1 || typesOfQn.length == 3) && (this.props.deck.cards.length == questions.length))))

    this.setState({
      ...this.state,
      loadingMessage                    : false
    })
    console.log("questions", questions);
  }

  startTest = () =>{
    this.props.history.push({
      pathname                          : `/deck/${this.props.match.params.id}/test/start`
    })
  }

  render() {
    var { name, cards }                 = this.props.deck
    var { loadingMessage }              = this.state

    return (
      <DocumentMeta title={!name ? "Loading Test Options" : `${name}'s Test`}>
        {
          loadingMessage != false && !cards &&
            <Fallback message={loadingMessage} />
        }
        {
          cards &&
            <div className="d-flex wholePageWithNav justify-content-center align-items-center">
              <div className="text-center">
                <h5>
                  {loadingMessage != false && loadingMessage}
                  {loadingMessage == false && "We are done generating your test questions!"}
                </h5>
                If you'd like to have a short revision
                <Flashcards cards={cards}/>
                {
                  loadingMessage == false &&
                    <button className="btn btn-primary mt-2" onClick={() => this.startTest()}>Start Test</button>
                }
              </div>
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
})(Generator)