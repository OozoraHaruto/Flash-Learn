import React from 'react';

import { Alert, NormLink, dataLoading } from 'reuse'
import Flashcards from 'app/components/Deck/Flashcards'

export default class Header extends React.Component{
  constructor(){
    super()
    this.state = {
      submittingDelete                                    : false
    }
  }

  render(){
    const { 
      deckId, 
      isMe, 
      name, 
      owner: { displayName, id, photoURL }, 
      cards,
      followerCount,
      following,
      followDeck,
    }                                                     = this.props
    const LoadingFlashcards                               = dataLoading(false, "The flashcards should be loaded soon")(Flashcards)

    const renderActionButtons = () => {
      const { submittingDelete }                          = this.state
      const setButtonText = () => {
        const formatSubriberNumber = () =>{
          if(followerCount == undefined){
            return ""
          }else{
            return followerCount
          }  
        }

        switch (following) {
          case "editing": return "Submitting"
          case true: return `Cancel Follow (${formatSubriberNumber()})`
          default: return `Follow Deck (${formatSubriberNumber()})`
        }
      }

      if (isMe) {
        return (
          <React.Fragment>
            <NormLink to={`/deck/${deckId}/edit`} title="Edit Deck" className="btn btn-outline-secondary btn-sm mx-3" />
            <button type="button" className={`btn btn-outline-danger btn-sm ${submittingDelete && "animated pulse infinite"}`} data-toggle="modal" data-target="#deleteConfirmationModal">
              {submittingDelete ? "Deleting Deck" : "Delete Deck"}
            </button>
          </React.Fragment>
        )
      } 
      return (
          <button type="button" className={`btn btn-outline-danger btn-sm ml-3 ${(following == "editing") && 'disabled animated pulse infinite'}`} onClick={() => followDeck()} disabled={(following == "editing" || isMe || following == undefined)}>
            {setButtonText()}
          </button>
        )
    }

    const deleteCurrentDeck = () =>{
      if(this.state.submittingDelete){
        return
      }

      const { deleteDeck } = this.props

      this.setState({
        ...this.state,
        submittingDelete                                    : true
      })
      deleteDeck()
    }

    return (
      <React.Fragment>
        <div className="container-fluid bg-light sticky-top">
          <div className="row">
            <div className="container">
              <div className="row py-3">
                <div className="col-sm col-sm-auto text-md-left text-sm-left text-center">
                  <img src={`${photoURL}?s=69`} className="" />
                </div>
                <div className="col text-sm-center text-md-left text-sm-left text-center">
                  <h3>{name}</h3>
                  <small className="text-muted">
                    by <NormLink title={displayName} to={`/profile/${id}`} className="text-muted" />
                  </small>
                  {renderActionButtons()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid bg-light">
          <div className="row">
            <div className="container">
              <div className="row my-3">
                <div className="col-sm text-sm-center text-md-left text-sm-left text-center">
                  <NormLink title="Flashcards" to={`/deck/${deckId}/flashcards`} /><br />
                  <span className="text-muted">Tests</span><br />
                  <NormLink title="MCQ" to={`/deck/${deckId}/test/MCQ`} /><br />
                  <NormLink title="Open Ended" to={`/deck/${deckId}/test/OpenEnded`} /><br />
                  <NormLink title="True / False" to={`/deck/${deckId}/test/TrueFalse`} /><br />
                  <NormLink title="All" to={`/deck/${deckId}/test/All`} /><br />
                </div>
                <div className="col">
                  <div className="row h-100">
                    <LoadingFlashcards loading={cards.loading} cards={cards} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Alert id="deleteConfirmationModal" title={`Are you sure you want to delete "${name}"`} message="You won't be able to recover this deck after deletion. Do you want to continue?" closeButtonText="No" extraButtons={[
          {func: deleteCurrentDeck, title: "Yes"}
        ]} />
      </React.Fragment>
    )
  }
}