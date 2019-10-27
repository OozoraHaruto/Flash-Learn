import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';
var Latex = require('react-latex');

import { accounts } from 'actions'
import { pushToError } from 'componentConstants'

export default class Gamification extends Component {
  constructor(props){
    super(props)

    this.state                    = { achievements: false }
  }

  componentDidMount(){
    var hash = document.location.hash
    if (hash != "") {
      $('a[href="' + hash + '"]').tab('show')
    }
    const { getAchievements } = accounts

    getAchievements().then(res => {
      if(res.success){
        this.setState({ achievements: res.data})
      }else{
        throw res
      }
    }).catch(e => {
      return pushToError(this.props.history, this.props.location, e)
    })
  }

  render() {
    var meta = {
      title: "FAQ - Gamification"
    }

    var { achievements }          = this.state

    const renderAchievement = achievement =>{
      const data                  = achievement.data()
      const id                    = achievement.id
      return (
        <tr key={id}>
          <td scope="row">{data.badges[data.badges.length - 1]}</td>
          <td>
            <ul>
              {
                data.levels.map(level =>{
                  return <li key={`${id}_level_${level}`}>{data.name.replace("$1", level)}</li>
                })
              }
            </ul>
            {data.extraMessage && 
              data.extraMessage.split(",").map((message, i) => 
                <small key={`${id}_extraMessage_${i}`} className="d-block">{message}</small>
            )}
          </td>
        </tr>
      )
    }

    return (
      <DocumentMeta {...meta}>
        <div className='container mt-3'>
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-pills"role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" id="leaderboards-tab" data-toggle="pill" href="#leaderboards" role="tab" aria-controls="leaderboards" aria-selected="true">Leaderboards</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="achievements-tab" data-toggle="pill" href="#achievements" role="tab" aria-controls="achievements" aria-selected="false">Achievements</a>
                </li>
              </ul>
            </div>
            <div className="card-body tab-content">
              <div className="tab-pane fade show active" id="leaderboards" role="tabpanel" aria-labelledby="leaderboards-tab">
                <h2>Type of leaderboards</h2>
                <ol>
                  <li><a href="#tests">For Tests</a></li>
                  <li><a href="#points">Points</a></li>
                </ol>
                <h3 id="tests">For Tests</h3>
                <div>
                  Tests leaderboards will be based on the time taken to complete the test.<br />
                  To qualify for the leaderboards all questions have to be answered correctly.<br />
                  There are separate leaderboards for each test. We wish you all the best to get to the top 3.
                </div>
                <h3 id="points">Points</h3>
                <div>
                  Point leaderboards will be reset each month. (This is to give new members a chance to claim the top seat)<br />
                  Forfeiting midway means forfeiting all the points that can be earn for the current test<br />
                  Points will be given based on the test taken. Below is the breakdown<br />
                  <ul>
                    <li>+10 upon completing</li>
                    <li>Test Combo</li>
                    <ul>
                      <li>+5 for combos 80% and over</li>
                      <li>+4 for combos 70% and over</li>
                      <li>+3 for combos 60% and over</li>
                      <li>+2 for combos 50% and over</li>
                      <li>+1 for combos 40% and over</li>
                      <li>For example, a test with 50 questions will require a combo of <Latex>{'$50 \\times \\frac{80}{100} = 40$'}</Latex> to get +5 points </li>
                    </ul>
                  </ul>
                </div>
              </div>
              <div className="tab-pane fade" id="achievements" role="tabpanel" aria-labelledby="achievements-tab">
                Achievements are awarded after meeting certain requirements<br />
                Following are the achievements that you can get<br />
                <br />
                {!achievements && <div>Loading..</div>}
                {achievements && achievements.length != 0 &&
                  <table className="table table-striped table-inverse">
                    <thead className="thead-inverse">
                      <tr>
                        <th>Image</th>
                        <th>Requirements</th>
                      </tr>
                    </thead>
                    <tbody>
                    {achievements.map(doc => renderAchievement(doc))}
                    </tbody>
                  </table>
                }
              </div>
            </div>
          </div>
        </div>
      </DocumentMeta>
    )
  }
}
