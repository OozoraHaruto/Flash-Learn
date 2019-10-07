import React from 'react';
import { FaFrown } from "react-icons/fa";

import { NormLink } from 'reuse'
import Card from 'app/components/Account/subComponents/Profile/CardLink'
import * as comConst from 'componentConstants'

const DeckSummary = ({
  userId,
  title,
  cards,
  seeAllLink,
  hideFooter,
}) => {
  const generateEmptyArrayMessage = () =>{
    switch(seeAllLink){
      case comConst.PROFILE_DECK_CREATED:
        return `User has not create any decks`
      case comConst.PROFILE_DECK_SUBSCRIBED:
        return `User has not liked any decks`
    }
  }

  return (
    <React.Fragment>
      {
        cards.length == 0 &&
          <div className="container mt-4 text-center">
            <div className="jumbotron">
              <h1 className="display-4"><FaFrown/></h1>
              <p className="lead">{generateEmptyArrayMessage()}</p>
            </div>
          </div>
      }
      {
        cards.length > 0 &&
          <div className="container py-4">
            <div className="row d-flex justify-content-between d-flex align-items-center px-3">
              <h2>{title}</h2>
              {cards.length == 5 && <div><NormLink title="See all" to={`/profile/${userId}/deck/${seeAllLink}`} /></div>}
            </div>
            <div className="card-deck-scrollable flex-nowrap overflow-auto py-2">
              {
                cards.map(card =>
                  <Card key={card.id} card={card} noFooter={hideFooter}/>
                )
              }
            </div>
          </div>
      }
    </React.Fragment>
  )
}

export default DeckSummary