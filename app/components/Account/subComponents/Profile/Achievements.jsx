import React from 'react';

import Card from 'app/components/Account/subComponents/Profile/AchievementCard'

const Achievements = ({
  lists
}) => {
  const getLevelIndex = (userCurrent, levels) =>{
    for(let i = 0; i < levels.length; i++){
      if (userCurrent < levels[i]){
        return (i - 1)
      }
    }
    return levels.length
  }

  const levelColor = level =>{
    console.log("current level", level)
    switch (level){
      case -1: return "secondary"
      case 0: return "success"
      case 1: return "primary"
      case 2: return "info"
      default: return "warning"
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col">
          <h2>Achievements</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card-columns py-2">
            {
              lists != undefined &&
                lists[1].map((achievement, i) =>(
                  <Card key={`userAchievement_${achievement.id}`} user={lists[0][i]} {...{ achievement, getLevelIndex, levelColor}} />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievements