import React from 'react';

import Fallback from 'Fallback'

const DetailsWrapper = ({
  cards,
  leaderboards
})=>{

  return (
    <React.Fragment>
      <div className="row bg-light">
        <div className="col p-0">
          <nav className="nav nav-tabs justify-content-center" role="tablist">
            <a className="nav-link active" id="wordlist-tab" data-toggle="pill" href="#wordlist" role="tab" aria-controls="wordlist" aria-selected="true">Word List</a>
            <a className="nav-link" id="leaderboards-tab" data-toggle="pill" href="#leaderboards" role="tab" aria-controls="leaderboards" aria-selected="false">Leaderboards</a>
          </nav>
        </div>
      </div>
      <div className="card-body tab-content container">
        <div className="tab-pane fade show active" id="wordlist" role="tabpanel" aria-labelledby="wordlist-tab">
          {cards.loading && <Fallback wholePage={false} message="The word list should be loaded soon" />}
          {/* {!cards.loading &&
            <DetailsWrapper cards={cards} leaderboards={leaderboards} />
          } */}
        </div>
        <div className="tab-pane fade" id="leaderboards" role="tabpanel" aria-labelledby="leaderboards-tab">
          User will be given either the front or back of the flashcard and asked type out the correct answer.<br />
          User can choose the number of words to be tested.
          {/* TODO: Do when leaderboard is completed */}
        </div>
      </div>
    </React.Fragment>
  )
}

export default DetailsWrapper