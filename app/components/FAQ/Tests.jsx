import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';

export default class Tests extends Component {
  componentDidMount(){
    this.changeTab()
  }
  componentDidUpdate(prevProps){
    this.changeTab()
  }
  changeTab(){
    if (this.props.location.hash) {
      $('a[href="' + this.props.location.hash + '"]').tab('show')
    }
  }

  render() {
    var meta = {
      title: "FAQ - Tests"
    }

    return (
      <DocumentMeta {...meta}>
        <div className='container mt-3'>
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
                <li className="nav-item">
                  <a className="nav-link" id="ultimate-tab" data-toggle="pill" href="#ultimate" role="tab" aria-controls="ultimate" aria-selected="false">Ultimate (All)</a>
                </li>
              </ul>
            </div>
            <div className="card-body tab-content">
              <div className="tab-pane fade show active" id="mcq" role="tabpanel" aria-labelledby="mcq-tab">
                User will be given either the front or back of the flashcard and asked to pick from 4-6 choices.<br />
                User can choose the number of words to be tested.
                <div className="container-fluid mt-3">
                  <div className="row  justify-content-md-center">
                    <div className="col-4">
                      <img src="/images/FAQ/MCQ_2.png" alt="screenshot of MCQ test with 2 options" className="w-100" />
                    </div>
                    <div className="col-4">
                      <img src="/images/FAQ/MCQ_4.png" alt="screenshot of MCQ test with 4 options" className="w-100" />
                    </div>
                    <div className="col-4">
                      <img src="/images/FAQ/MCQ_6.png" alt="screenshot of MCQ test with 6 options" className="w-100" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="openended" role="tabpanel" aria-labelledby="openended-tab">
                User will be given either the front or back of the flashcard and asked type out the correct answer.<br />
                User can choose the number of words to be tested.
                <div className="container-fluid mt-3">
                  <div className="row  justify-content-md-center">
                    <div className="col-4">
                      <img src="/images/FAQ/Openended.png" alt="screenshot of Open ended test" className="w-100" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="truefalse" role="tabpanel" aria-labelledby="truefalse-tab">
                User will be given both the front and back of the flashcard and asked if it is correct.<br />
                User can choose the number of words to be tested.
                <div className="container-fluid mt-3">
                  <div className="row  justify-content-md-center">
                    <div className="col-4">
                      <img src="/images/FAQ/True_False.png" alt="screenshot of True or false test" className="w-100" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="ultimate" role="tabpanel" aria-labelledby="truefalse-tab">
                This is the ultimate test.<br />
                User will be tested on all the flashcard.<br />
                All three tests (<a href="#mcq">MCQ</a>, <a href="#openended">Open Ended</a> and <a href="#truefalse">true/false</a>) will be tested. Questions will be randomly assigned.
              </div>
            </div>
          </div>
        </div>
      </DocumentMeta>
    )
  }
}
