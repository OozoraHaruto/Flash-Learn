import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';
const { Random, MersenneTwister19937 } = require("random-js");
const random = new Random(MersenneTwister19937.autoSeed());

import * as comConst from 'componentConstants'
import Fallback from 'Fallback'
import { decks } from 'actions'

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

  generateQuestions = () =>{
    var deck                            = this.props.deck.cards.slice(0)
    const noOfQn                        = !this.props.match.params.noOfQn ? deck.length : this.props.match.params.noOfQn
    const typesOfQn                     = [comConst.TEST_MCQ, comConst.TEST_OPENENDED, comConst.TEST_TRUEFALSE]
    const testType                      = this.props.match.params.testType
    const isTestUltimate                = comConst.TEST_ULTIMATE == testType
    const { addTestToRedux }            = decks
    var cardDataList                    = []
    var questions                       = []

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
    const typeOfQn = () => isTestUltimate ? typesOfQn[generateRandomNumber(typesOfQn.length)] : testType
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

      addToQuestionArray(front ? card.data().front : card.data().back, choices[0], random.shuffle(choices), comConst.TEST_MCQ, card)
    }
    const createOpenEndedQuestion = card =>{
      if (random.bool()){
        addToQuestionArray(card.data().front, card.data().back.toLowerCase(), [], comConst.TEST_OPENENDED, card)
      }else{
        addToQuestionArray(card.data().back, card.data().front.toLowerCase(), [], comConst.TEST_OPENENDED, card)
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

      addToQuestionArray(`Is ${dataA} = ${dataB}?`, dataB == dataACorrectAns ? "True" : "False", ["True", "False"], comConst.TEST_TRUEFALSE, card)
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
    })

    if (comConst.TEST_OPENENDED != testType){
      cardDataList                      = deck.map(card=> {return {front: card.data().front, back: card.data().back}})
    }
    
    do{
      if (deck.length == 0) {
        deck                            = this.props.deck.cards.slice(0)
      }
      createQuestion()
    }while (noOfQn != questions.length)

    this.props.dispatch(addTestToRedux(this.props.deck.id, testType, this.props.deck.name, questions, this.props.deck.cards.length == questions.length))

    this.setState({
      ...this.state,
      loadingMessage                    : false
    })
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