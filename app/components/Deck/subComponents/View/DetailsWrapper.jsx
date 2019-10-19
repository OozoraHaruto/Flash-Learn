import React from 'react';

import { dataLoading } from 'reuse'
import * as comConst from 'componentConstants'

import WordList from 'app/components/Deck/subComponents/View/DetailsWrapper/WordList'
import Leaderboard from 'app/components/Deck/subComponents/View/DetailsWrapper/Leaderboard'

const DetailsWrapper = ({
  cards,
  leaderboards
})=>{
  const LoadingWordList     = dataLoading(false, "The word list should be loaded soon")(WordList)
  const LoadingLeaderboard  = dataLoading(false, "The leaderboard should be loaded soon")(Leaderboard)

  return (
    <React.Fragment>
      <div className="container-fluid bg-light">
        <div className="row">
          <div className="col p-0">
            <nav className="nav nav-tabs justify-content-center" role="tablist">
              <a className="nav-link active" id="wordlist-tab" data-toggle="pill" href="#wordlist" role="tab" aria-controls="wordlist" aria-selected="true">Word List</a>
              <a className="nav-link" id="leaderboards-tab" data-toggle="pill" href="#leaderboards" role="tab" aria-controls="leaderboards" aria-selected="false">Leaderboards</a>
            </nav>
          </div>
        </div>
      </div>
      <div className="card-body tab-content container">
        <div className="tab-pane fade show active" id="wordlist" role="tabpanel" aria-labelledby="wordlist-tab">
          <LoadingWordList loading={cards.loading} cards={cards} />
        </div>
        <div className="tab-pane fade" id="leaderboards" role="tabpanel" aria-labelledby="leaderboards-tab">
          <LoadingLeaderboard loading={leaderboards.loading} name="MCQ" rankings={leaderboards[comConst.TEST_MCQ]} />
          <LoadingLeaderboard loading={leaderboards.loading} name="Open ended" rankings={leaderboards[comConst.TEST_OPENENDED]} />
          <LoadingLeaderboard loading={leaderboards.loading} name="True or False" rankings={leaderboards[comConst.TEST_TRUEFALSE]} />
          <LoadingLeaderboard loading={leaderboards.loading} name="Ultimate" rankings={leaderboards[comConst.TEST_ULTIMATE]} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default DetailsWrapper