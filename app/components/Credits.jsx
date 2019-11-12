import React from 'react'
import DocumentMeta from 'react-document-meta';

const Credits = () =>{
  return(
    <DocumentMeta title="Credits">
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
                      <td scope="row"><a href="/images/FAQ/Decks-card.jpg" target="_blank">Flashcard picture in FAQ</a></td>
                      <td>Image by <a href="https://pixabay.com/users/AnnasPhotography-2657111/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1591812">AnnasPhotography</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1591812">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/FAQ/Test-card.jpg" target="_blank">Test picture in FAQ</a></td>
                      <td>Image by <a href="https://pixabay.com/users/Pixapopz-2873171/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1500720">Chuk Yong</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1500720">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/FAQ/Gamification-card.jpg" target="_blank">Gamification picture in FAQ</a></td>
                      <td>Image from <a href="https://commons.wikimedia.org/wiki/File:Gamification-in-business-illustration-web.jpg">Wiki Commons</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/ProfileLeaderboard/first.png" target="_blank">1<sup>st</sup> place picture in decks</a></td>
                      <td>Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614530">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614530">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/ProfileLeaderboard/second.png" target="_blank">2<sup>nd</sup> place picture in decks</a></td>
                      <td>Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614673">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614673">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/ProfileLeaderboard/third.png" target="_blank">3<sup>rd</sup> place picture in decks</a></td>
                      <td>Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614844">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614844">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/Error/404.jpg" target="_blank">Error 404</a></td>
                      <td>Image by <a href="https://pixabay.com/users/3D_Maennchen-1553824/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2314111">Peggy und Marco Lachmann-Anke</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2314111">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/Error/others.png" target="_blank">Other errors</a></td>
                      <td>Image by <a href="https://pixabay.com/users/manfredsteger-1848497/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3974187">Manfred Steger</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3974187">Pixabay</a></td>
                    </tr>
                    <tr>
                      <td scope="row"><a href="/images/Error/hi.png" target="_blank">Hidden Message</a></td>
                      <td>Image by <a href="https://pixabay.com/users/GDJ-1086657/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3791381">Gordon Johnson</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3791381">Pixabay</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentMeta>
  )
}

export default Credits