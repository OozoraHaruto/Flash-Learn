import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta';

import { 
  pushToError,
  TEST_MCQ, 
  TEST_OPENENDED, 
  TEST_TRUEFALSE, 
  TEST_ULTIMATE, 
} from 'componentConstants'
import { decks } from 'actions'

import { TextField, NormLink } from 'reuse'
import Fallback from 'Fallback'
import Flashcards from 'app/components/Deck/subComponents/FlashcardCarousel'

class TestOptions extends Component {
  constructor(props){
    super(props)
    this.state = {
      id                                    : props.match.params.id,
      test                                  : [TEST_ULTIMATE],
      numberOfQuestions                     : ""
    }
  }

  componentDidMount(){
    if (this.props.match.params.id != this.props.deck.id){
      this.getDeckAndCards();
    }
  }

  getDeckAndCards = () =>{
    const { 
      getDeck, 
      getCards, 
      addDeckToRedux 
    }                                       = decks
    const { id }                            = this.props.match.params
    var name                                = ""

    getDeck(id).then(res =>{
      if(res.success){
        name                                = res.data.name
        return getCards(id)
      }else{
        throw res
      }
    }).then(res=>{
      if(res.success){
        this.props.dispatch(addDeckToRedux(id, name, res.data))
      }else{
        throw res
      }
    }).catch(e => {
      if (!this.props.history.location.state) {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
      } else if (this.props.history.location.state.from == '/login') {
        return pushToError(this.props.history, this.props.location, e)
      } else {
        return this.props.history.push({ pathname: '/login', search: `?from=${encodeURI(this.props.location.pathname)}` })
      }
    })
  }

  updateNumberOfQuestionsValue = evt =>{
    this.setState({
      ...this.state,
      numberOfQuestions                     : evt.target.value
    })
  }

  goToTest = () =>{
    var { id, test, numberOfQuestions }     = this.state

    const formatURLQuery = () =>{
      if (test.length == 1){
        return test[0]
      }else if (test.length == 3){
        return TEST_ULTIMATE
      }else{
        return test.join("-")
      }
    }
    
    if(numberOfQuestions == "" && !Number.isInteger(Number(numberOfQuestions))){
      return this.props.history.push(`/deck/${id}/test/${formatURLQuery()}`)
    }else{
      return this.props.history.push(`/deck/${id}/test/${formatURLQuery()}/${numberOfQuestions}`)
    }
  }


  render() {
    var { id, name, cards }                 = this.props.deck
    var { numberOfQuestions }               = this.state
    const clickStyle                        = {cursor: "pointer"}

    const colorOption = option =>{
      return this.state.test.includes(option) ? "border-primary" : ""
    }

    const changeOption = option =>{
      let test                              = this.state.test
      if (option == TEST_ULTIMATE){
        test                                = [TEST_ULTIMATE]
      }else{
        if(test.includes(TEST_ULTIMATE)){
          test                              = [option]
        }else{
          let index                         = test.indexOf(option)
          if(index == -1){
            test.push(option)
          }else{
            test.splice(index, 1)
            if(test.length == 0){
              test                          = [TEST_ULTIMATE]
            }
          }
        }
      }
      this.setState({
        ...this.state,
        test
      })
    }

    return (
      <DocumentMeta title={!name ? "Loading Test Options" : `${name}'s Test Options`}>
        {jQuery.isEmptyObject(this.props.deck) &&
          <Fallback />
        }
        {
          !jQuery.isEmptyObject(this.props.deck) &&
            <React.Fragment>
              <div className="container-fluid bg-light sticky-top">
                <div className="row">
                  <div className="container">
                    <div className="row py-3">
                      <div className="col text-sm-center text-md-left text-sm-left text-center">
                        <NormLink to={`/deck/${id}`} title={name} className="h3 text-body"/>
                      </div>
                      <div className="col-sm col-sm-auto text-md-left text-sm-left text-center">
                        <button type="button" className="btn btn-outline-info" data-toggle="modal" data-target="#ReviewCards">Review Cards</button>
                        <button type="button" className="btn btn-outline-primary ml-2" onClick={()=>this.goToTest()}>Take Test</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col mt-4">
                    <TextField type="number" field={{ name: "noOfQns" }} placeholder="Number of Questions" form={{ touched: true, errors: true }} value={numberOfQuestions} onChange={evt => this.updateNumberOfQuestionsValue(evt)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-4 col-xl-3">
                    <div className={`card ${colorOption(TEST_MCQ)} mt-4`} onClick={() => changeOption(TEST_MCQ)} style={clickStyle}>
                      <div className="card-body">
                        <h5 className="card-title">MCQ</h5>
                        <p className="card-text">
                          You will be given either the front or back of the flashcard and asked to pick from 4-6 choices.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 col-xl-3">
                    <div className={`card ${colorOption(TEST_OPENENDED)} mt-4`} onClick={() => changeOption(TEST_OPENENDED)} style={clickStyle}>
                      <div className="card-body">
                        <h5 className="card-title">Open Ended</h5>
                        <p className="card-text">
                          You will be given either the front or back of the flashcard and asked type out the correct answer.
                      </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 col-xl-3">
                    <div className={`card ${colorOption(TEST_TRUEFALSE)} mt-4`} onClick={()=>changeOption(TEST_TRUEFALSE)} style={clickStyle}>
                      <div className="card-body">
                        <h5 className="card-title">True or False</h5>
                        <p className="card-text">
                          You will be given both the front and back of the flashcard and asked if it is correct.
                      </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-12 col-xl-3">
                    <div className={`card ${colorOption(TEST_ULTIMATE)} mt-4`} onClick={()=>changeOption(TEST_ULTIMATE)} style={clickStyle}>
                      <div className="card-body">
                        <h5 className="card-title">Ultimate</h5>
                        <p className="card-text">
                          This is the ultimate test.<br />
                          You will be tested on all the flashcard.<br />
                          All three tests (MCQ, Open Ended and true/false) will be tested. Questions will be randomly assigned.
                      </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal fade" id="ReviewCards">
                <div className={"modal-dialog modal-dialog-scrollable modal-dialog-centered"} role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="ReviewCardsModalLabel">Cards</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body"><Flashcards cards={cards} /></div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">I'm ready</button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
        }
      </DocumentMeta>
    )
  }
}

export default connect(state => {
  return {
    deck: state.currentDeckReducer
  }
})(TestOptions)