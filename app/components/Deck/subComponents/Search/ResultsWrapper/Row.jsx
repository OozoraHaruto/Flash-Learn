import React from 'react';

import { formatDateTime } from 'componentConstants'
import { NormLink } from 'reuse'

const Row = ({
  deck,
  owner,
}) => (
  <div className="row">
    <div className="col">
      <div className="card mt-3">
        <div className="card-body">
          <NormLink title={deck.name} to={`/deck/${deck.id}`} className="h5 text-dark card-title d-block" />
          <div className="d-flex">
            <div>
              <img src={`${owner.photoURL}?s=50`} alt="user's profile picture" className="rounded" />
            </div>
            <div className="ml-2 d-flex flex-column justify-content-center">
                <div>by <NormLink title={owner.displayName} to={`/profile/${deck.owner.id}`} className="text-dark" /></div>
              <small className="text-muted">Last modified {formatDateTime(deck.modified, "", true)}</small>
            </div>
          </div>
          {
            deck.notIn && deck.notIn.length > 0 &&
              <small className="text-muted">
                {
                  deck.notIn.map(term => <s key={`notFound_${term}`} className="ml-1">{term}</s>)
                }
              </small>
          }
        </div>
      </div>
    </div>
  </div>
)

export default Row