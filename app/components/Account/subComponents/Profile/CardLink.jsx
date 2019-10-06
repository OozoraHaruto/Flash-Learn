import React from 'react';

import { NormLink } from 'reuse'

const CardLink = ({
  card,
  className,
}) => (
  <NormLink to={`/deck/${card.id}`} className={`card ${className}`}>
    <div className="card-body">
      <div className="card-title">{card.data().name}</div>
    </div>
  </NormLink>
)

export default CardLink