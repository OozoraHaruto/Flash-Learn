import React, { Component } from 'react'

export default class Credits extends Component {
  render() {
    return (
      <div className="container pt-3">
        <div id="sectionImages" role="tablist" aria-multiselectable="true">
          <div className="card">
            <a data-toggle="collapse" data-parent="#sectionImages" href="#sectionImagesData" aria-expanded="true" aria-controls="sectionImagesData">
              <div className="card-header" role="tab" id="sectionImagesHeader">
                <h5 className="mb-0">
                    Images
                </h5>
              </div>
            </a>
            <div id="sectionImagesData" className="collapse in" role="tabpanel" aria-labelledby="sectionImagesHeader">
              <div className="m-2">
                <table className="table table-sm table-striped table-inverse">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row"><a href="/images/Test-card.png" target="_blank">Test picture in FAQ</a></td>
                      <td>Image by <a href="https://pixabay.com/users/flag-276981/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=670091">flag</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=670091">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/Gamification-card.jpg" target="_blank">Gamification picture in FAQ</a></td>
                      <td>Image from <a href="https://commons.wikimedia.org/wiki/File:Gamification-in-business-illustration-web.jpg">Wiki Commons</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
