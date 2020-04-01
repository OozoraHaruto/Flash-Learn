import React from 'react'

import { decks } from 'actions'
const { formatAsHTMLElement } = decks

const Option = ({
  data,
  className,
  userAnswered,
}) => {
  return (
    <div className="flex-grow-1 mt-2" style={{cursor: "pointer", width: "50%"}} onClick={() => userAnswered(data)}>
      <div className={`card card-block d-flex h-100 ${className}`}>
        <div className="card-body align-items-center d-flex justify-content-center text-center">
          <h5 className="card-title">{formatAsHTMLElement(data)}</h5>
        </div>
      </div>
    </div>
  )
}

export default Option