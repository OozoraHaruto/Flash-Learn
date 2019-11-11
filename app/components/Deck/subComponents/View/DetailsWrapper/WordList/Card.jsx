import React from 'react'
import PropTypes from 'prop-types';

import { decks } from 'actions'
const { formatAsHTMLElement } = decks

const Card = ({
  back,
  backSub,
  front,
}) => {

  return (
    <div className="card">
      <div className="card-body text-center">
        <div className="card-title h3">{formatAsHTMLElement(front)}</div>
        <div className="card-text">
          <div>{formatAsHTMLElement(back)}</div>
          <small className="text-muted">{formatAsHTMLElement(backSub)}</small>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  front: PropTypes.string.isRequired,
  back: PropTypes.string.isRequired,
  backSub: PropTypes.string.isRequired,
}

Card.defaultProps = {
  backSub: "",
}

export default Card