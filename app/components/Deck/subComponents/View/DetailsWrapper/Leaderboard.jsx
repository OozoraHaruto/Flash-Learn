import React from 'react'
import PropTypes from 'prop-types';
import { FaFrown } from "react-icons/fa";
import { CloudinaryImage } from 'reuse'

const Leaderboard = ({
  name,
  rankings,
}) => {
  return (
    <div className="container">
      <div className="row text-center">
        <h3 className="col">{name}</h3>
      </div>
      {
        rankings == false &&
        <div className="row">
          <div className="col text-center">
            <div className="jumbotron">
              <h1 className="display-4"><FaFrown /></h1>
              <p className="lead">No one took the test</p>
            </div>
          </div>
        </div>
      }
      {
        rankings != false &&
        <React.Fragment>
          <div className="row d-none d-md-flex">
            <div className="col-4 px-4 d-flex align-self-end">
              {
                rankings.length >= 2 &&
                  <div>
                    <CloudinaryImage img="ProfileLeaderboard/second_acmj9y" className="w-100" />
                  </div>
              }
            </div>
            <div className="col-4">
              <div>
                <CloudinaryImage img="ProfileLeaderboard/first_if1o4v" className="w-100" />
              </div>
            </div>
            <div className="col-4 px-5 d-flex align-self-end">
              {
                rankings.length >= 3 &&
                  <div>
                    <CloudinaryImage img="ProfileLeaderboard/third_wuqdyl" className="w-100" />
                  </div>
              }
            </div>
          </div>
          <div className="row d-none d-md-flex">
            <div className="col-4 text-center">
              {rankings.length >= 2 &&
                <React.Fragment>
                  <h5>{rankings[1].data().timeString}</h5>
                  <div>{rankings[1].data().name}</div>
                </React.Fragment>
              }
            </div>
            <div className="col-4 text-center">
              <h4>{rankings[0].data().timeString}</h4>
              <div>{rankings[0].data().name}</div>
            </div>
            <div className="col-4 text-center">
              {rankings.length >= 3 &&
                <React.Fragment>
                  <h6>{rankings[2].data().timeString}</h6>
                  <div>{rankings[2].data().name}</div>
                </React.Fragment>
              }
            </div>
          </div>
          <div className="row d-flex d-md-none">
            <div className="col table-responsive">
              <table className="table table-hover table-striped">
                <tbody>
                  <tr>
                    <th scope="row"><CloudinaryImage img="ProfileLeaderboard/first_if1o4v" height={30} /></th>
                    <td>{rankings[0].data().name}</td>
                    <td>{rankings[0].data().timeString}</td>
                  </tr>
                  {
                    rankings.length >= 2 &&
                      <tr>
                        <th scope="row"><CloudinaryImage img="ProfileLeaderboard/second_acmj9y" height={30} /></th>
                        <td>{rankings[1].data().name}</td>
                        <td>{rankings[1].data().timeString}</td>
                      </tr>
                  }
                  {
                    rankings.length >= 3 &&
                      <tr>
                        <th scope="row"><CloudinaryImage img="ProfileLeaderboard/third_wuqdyl" height={30} /></th>
                        <td>{rankings[2].data().name}</td>
                        <td>{rankings[2].data().timeString}</td>
                      </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </React.Fragment>
      }
    </div>
  )
}

Leaderboard.propTypes = {
  name        : PropTypes.string.isRequired,
  leaderboard : PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.array.isRequired]),
}

export default Leaderboard