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
          {decks.length > 0 && <small>We found {decks.length} deck{decks.length > 1 && "s"}.</small>}
          {decks.length == 0 && <small>We did not manage to find any decks.</small>}
        </div>
      </div>
      {
        decks.length > 0 &&
        decks.map(deck => <Row key={`result_deck_${deck.id}`} deck={deck} owner={users[deck.owner]} />)
      }
    </React.Fragment>
  )
}

export default ResultsWrapper