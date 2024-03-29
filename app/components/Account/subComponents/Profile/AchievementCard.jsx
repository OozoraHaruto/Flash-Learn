import React from 'react';
var Latex = require('react-latex');

import { CloudinaryImage } from 'reuse'

const AchievementCard = ({
  user,
  achievement,
  getLevelIndex,
  levelColor,
}) => {
  const userLevel = getLevelIndex(user.data().current, achievement.data().levels)
  const maxLevel = achievement.data().levels.length
  const color = levelColor(userLevel)
  const name = achievement.data().name.split("$1")

  const getImageName = () =>{
    if (userLevel < 0){
      return achievement.data().emptyBadge
    }else if (userLevel == maxLevel){
      return achievement.data().badges[userLevel-1]
    }else{
      return achievement.data().badges[userLevel]
    }
  }

  return (
    <div className="card">
      <CloudinaryImage img={getImageName()} className="card-img-top" alt={`Leaderboard level ${userLevel == maxLevel ? "max" : userLevel} badge`}/>
      <div className="card-body">
        <h5 className="card-title text-center">{name[0]}<Latex>{'$x$'}</Latex>{name[1]}</h5>
        <div className="card-text">
          <div className="d-flex flex-column">
            <div className="d-flex">
              <div className={`text-${color}`}>
                <b>{userLevel == maxLevel ? "MAX" : `${user.data().current}/${achievement.data().levels[(userLevel + 1)]}`}</b>
              </div>
            </div>
            <div className="progress">
              <div className={`progress-bar bg-${color}`} style={{ width: `${userLevel == maxLevel ? 100 : ((user.data().current / achievement.data().levels[(userLevel + 1)]) * 100)}%` }} role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementCard