import React from 'react'
import PropTypes from 'prop-types';

import Card from 'app/components/Deck/subComponents/View/DetailsWrapper/WordList/Card'

const WordList = ({
  cards,
}) => {
  return (
    <div className="card-columns">
      {
        cards.map(card =>
          <Card key={`WordListCard_${card.id}`} {...card.data()}/>
        )
      }
    </div>
  )
}

WordList.propTypes = {
  cards: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired])
}

export default WordList