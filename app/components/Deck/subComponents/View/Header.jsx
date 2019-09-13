import React from 'react';

import Fallback from 'Fallback'
import { NormLink } from 'reuse'

const Header = ({
  deckId,
  isMe,
  name,
  owner: {displayName, id, photoURL},
  cards
}) =>{
  return(
    <div className="container">
      <div className="row">
        <div className="col-sm col-sm-auto text-md-left text-sm-left text-center">
          <img src={`${photoURL}?s=70`} className="" />
        </div>
        <div className="col text-sm-center text-md-left text-sm-left text-center">
          <h3>{name}</h3>
          <small className="text-muted">
            by <NormLink title={displayName} to={`/profile/${id}`} className="text-muted"/>
          </small>
        </div>
      </div>
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
          {cards.loading && <Fallback wholePage={false} message="The cards should be loaded soon" />}
          {/* TODO: Load Cards */}
        </div>
      </div>
    </div>
  )
}

export default Header