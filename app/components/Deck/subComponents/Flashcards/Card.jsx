import React from 'react'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      front: true,
    }
  }
  componentDidMount(){
    this.animateCard('tada')
  }

  componentDidUpdate(nextProps) {
    const { index } = this.props;
    const { index: nextIndex } = nextProps;
    if (index == nextIndex) {
      this.animateCard('flipInX') 
    }else{
      this.setState({
        ...this.state,
        front: true
      })
      if(index < nextIndex){
        this.animateCard(((nextIndex - index) == 1) ? 'slideInLeft' : 'slideInRight')
      }else{
        this.animateCard(((index - nextIndex) == 1) ? 'slideInRight' : 'slideInLeft')
      }
    }
  }

  changeIndex = () =>{
    this.setState({
      ...this.state,
      front: !this.state.front
    })
  }

  animateCard = animation => {
    const eleCard = document.getElementById('flashcard_card')
    eleCard.classList.add('animated', animation)

    const handleAnimationEnd = () => {
      eleCard.classList.remove('animated', animation)
      eleCard.removeEventListener('animationend', handleAnimationEnd)
    }

    eleCard.addEventListener('animationend', handleAnimationEnd)
  }

  render() {
    const renderCardDetails = () =>{
      const { front } = this.state
      const { card } = this.props

      
      if (front){
        return (
          <div className="h3 m-0">{card.front}</div>
        )
      }
      return(
        <React.Fragment>
          <div className="h3 m-0">{card.back}</div>
          <div className="text-muted text-small">{card.backSub}</div>
        </React.Fragment>
      )
    }
    
    return (
      <div id="flashcard_card" className="card flex-grow-1 w-100" onClick={()=>this.changeIndex()}>
        <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
          {renderCardDetails()}
        </div>
      </div>
    )
  }
}