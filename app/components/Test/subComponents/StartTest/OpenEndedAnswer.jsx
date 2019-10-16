import React, { Component } from 'react'

export default class OpenEndedAnswer extends Component{
  constructor(){
    super()
    this.state={
      answer                            : ""
    }
  }


  updateAnswerValue = evt => {
    this.setState({
      ...this.state,
      answer                            : evt.target.value
    })
  }

  submitForm = (e, answer) =>{
    e.preventDefault(); 
    this.props.userAnswered(answer.trim().toLowerCase())
    this.setState({
      answer                            : "",
    })
  }

  render(){
    const { answer }                    = this.state

    return(
      <div className="flex-grow-1 mt-2 d-flex flex-column">
        <form className="flex-grow-1 d-flex flex-column" onSubmit={e => this.submitForm(e, answer)}>
          <div className="flex-grow-1 d-flex flex-column align-items-center">
            <textarea className="form-control w-100 flex-grow-1 mb-3" id="exampleFormControlTextarea1" placeholder="Answer" rows="1" value={answer} onChange={evt => this.updateAnswerValue(evt)}></textarea>
          </div>
          <div>
            <button type="submit" className="btn btn-primary btn-block">Submit Answer</button>
          </div>
        </form>
      </div>
    )
  }
}