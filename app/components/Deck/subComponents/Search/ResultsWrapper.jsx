import React from 'react';

import Row from 'app/components/Deck/subComponents/Search/ResultsWrapper/Row'

const ResultsWrapper = ({
  decks,
  users,
}) => {
  return (
    <React.Fragment>
      <div className="row mt-3">
        <div className="col">
          <small>We found {decks.length} deck{decks.length > 1 && "s"}.</small>
        </div>
      </div>
      {
        decks.length > 1 &&
          decks.map(deck => <Row key={`result_deck_${deck.id}`} deck={deck} owner={users[deck.owner.id]} />)
      }
    </React.Fragment>
  )
}

export default ResultsWrapper