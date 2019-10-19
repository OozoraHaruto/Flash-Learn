import React from 'react'
import PropTypes from 'prop-types';

const Card = ({
  front,
  back,
  backSub,
}) => {
  return (
    <div className="card">
      <div className="card-body text-center">
        <div className="card-title h3">{front}</div>
        <div className="card-text">
          <div>{back}</div>
          <small className="text-muted">{backSub}</small>
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