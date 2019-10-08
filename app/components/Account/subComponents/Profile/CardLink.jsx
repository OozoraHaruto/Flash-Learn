import React from 'react';

import { NormLink } from 'reuse'
import * as comConst from 'componentConstants'

const CardLink = ({
  card,
  className,
  hideFooter,
}) => {
  const renderFooter = () =>{
    const details = checkDetailsToRender()
    if (details != false){
      return(
        <div className="card-footer">
          <div className={`text-muted text-capitalize ${details.className}`}>
            {details.text}
          </div>
        </div>
      )
    }
  }
  const checkDetailsToRender = () =>{
    if(card.data().modified){
      return { 
        text                : `last updated on ${comConst.formatDateTime(card.data().modified.toMillis())}`,
        className           : 'small'
      }
    }

    return false
  }

  return (
    <NormLink to={`/deck/${card.id}`} className={`card hover ${className} text-decoration-none`}>
      <div className="card-body text-center">
        <h5 className="card-title text-body m-0">{card.data().name}</h5>
      </div>
      { 
        !hideFooter &&
          renderFooter()
      }
    </NormLink>
  )
}

export default CardLink