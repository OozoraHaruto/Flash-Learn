import React from 'react';

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