import React, { Component } from 'react'

export default class Tests extends Component {
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
                <a className="nav-link active" id="mcq-tab" data-toggle="pill" href="#mcq" role="tab" aria-controls="mcq" aria-selected="true">MCQ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="openended-tab" data-toggle="pill" href="#openended" role="tab" aria-controls="openended" aria-selected="false">Open Ended</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="truefalse-tab" data-toggle="pill" href="#truefalse" role="tab" aria-controls="truefalse" aria-selected="false">True/False</a>
              </li>
            </ul>
          </div>
          <div className="card-body tab-content">
            <div className="tab-pane fade show active" id="mcq" role="tabpanel" aria-labelledby="mcq-tab">
              mcq
            </div>
            <div className="tab-pane fade" id="openended" role="tabpanel" aria-labelledby="openended-tab">
              openended
            </div>
            <div className="tab-pane fade" id="truefalse" role="tabpanel" aria-labelledby="truefalse-tab">
              true
            </div>
          </div>
        </div>
      </div>
    )
  }
}
