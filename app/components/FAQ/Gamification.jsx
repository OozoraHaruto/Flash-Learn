import React, { Component } from 'react'

export default class Gamification extends Component {
  componentDidMount(){
    var hash = document.location.hash
    if (hash != "") {
      $('a[href="' + hash + '"]').tab('show')
    }
  }
  render() {
    return (
      <div className='container pt-3'>
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

              <h3 id="points">Points</h3>
            </div>
            <div className="tab-pane fade" id="achievements" role="tabpanel" aria-labelledby="achievements-tab">
              Achievements
            </div>
          </div>
        </div>
      </div>
    )
  }
}
