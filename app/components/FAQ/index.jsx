import React from 'react'
import DocumentMeta from 'react-document-meta';

import { CloudinaryImage, NormLink } from 'reuse'

const index = () =>{
  return (
    <DocumentMeta title="FAQ">
      <div className="container">
        <div className="text-center display-4">FAQs</div>
        <div className="card-columns">
          <div className="card">
            <CloudinaryImage className="card-img-top" img="FAQ/Decks-card_loyfwz" alt="" />
            <div className="card-body">
              <h4 className="card-title">Decks</h4>
              <p className="card-text">Decks refers to a stack of flashcards for this website</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <NormLink to="/faq/decks#how-to-create" title="How do I to create?" />
              </li>
              <li className="list-group-item">
                <NormLink to="/faq/decks#how-to-format" title="Card text formats" />
              </li>
            </ul>
          </div>

          <div className="card">
            <CloudinaryImage className="card-img-top" img="FAQ/Test-card_idhhg4" alt="" />
            <div className="card-body">
              <h4 className="card-title">Tests</h4>
              <p className="card-text">Different tests that is offered to users</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <NormLink to="/faq/tests#mcq" title="Multiple Choice" />
              </li>
              <li className="list-group-item">
                <NormLink to="/faq/tests#openended" title="Open Ended" />
              </li>
              <li className="list-group-item">
                <NormLink to="/faq/tests#truefalse" title="True/False" />
              </li>
              <li className="list-group-item">
                <NormLink to="/faq/tests#ultimate" title="Ultimate (All)" />
              </li>
            </ul>
          </div>

          <div className="card">
            <CloudinaryImage className="card-img-top" img="FAQ/Gamification-card_mnlnvs" alt="" />
            <div className="card-body">
              <h4 className="card-title">Gamification</h4>
              <p className="card-text">Gamification refers to the use of game elements and mechanics in non-game contexts</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <NormLink to="/faq/gamification#leaderboards" title="Leaderboards" />
              </li>
              <li className="list-group-item">
                <NormLink to="/faq/gamification#achievements" title="Achievements" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DocumentMeta>
  )
}

export default index;