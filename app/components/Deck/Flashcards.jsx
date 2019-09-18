import React from 'react'

import Card from 'app/components/Deck/subComponents/Flashcards/Card'

export default class Flashcards extends React.Component{
  constructor(props){
    super(props)
    this.state={
      currentIndex: 0,
      maxIndex: (props.cards.length - 1)
    }
  }

  changeIndex = (increment) =>{
    const { currentIndex, maxIndex } = this.state
    var newIndex = increment ? currentIndex + 1 : currentIndex - 1
    if(increment && newIndex > maxIndex){
      newIndex = 0
    }else if (!increment && newIndex < 0){
      newIndex = maxIndex
    }

    this.setState({
      ...this.state,
      currentIndex: newIndex
    })
  }

  render(){
    const { currentIndex } = this.state
    const { cards } = this.props
    
    return (
      <div className="d-flex flex-column h-100 w-100 overflow-hidden">
        <div className="flex-grow-1">
          <Card index={currentIndex} card={cards[currentIndex].data()} />
        </div>
        <div>
          <div className="d-flex">
            <div className="flex-grow-1 text-right">
              <button className="btn btn-link" onClick={() => this.changeIndex(false)}>＜</button>
            </div>
            <div className="d-flex align-items-center">
              <div>{`${currentIndex + 1} / ${cards.length}`}</div>
            </div>
            <div className="flex-grow-1 text-left">
              <button className="btn btn-link" onClick={() => this.changeIndex(true)}>＞</button>
            </div>
          </div>
        </div>
      </div>
    )
  } 
}