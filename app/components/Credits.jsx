import React from 'react'
import DocumentMeta from 'react-document-meta';
var HtmlToReactParser = require('html-to-react').Parser;

import { CloudinaryImage } from 'reuse'

const Credits = () =>{
  const imagesUsed = [
    {
      image: "FAQ/Decks-card_loyfwz",
      placeOfUse: "Flashcard picture in FAQ",
      link: 'Image by <a href="https://pixabay.com/users/AnnasPhotography-2657111/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1591812">AnnasPhotography</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1591812">Pixabay</a>',
    }, {
      image: "FAQ/Test-card_idhhg4",
      placeOfUse: "Test picture in FAQ",
      link: 'Image by <a href="https://pixabay.com/users/Pixapopz-2873171/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1500720">Chuk Yong</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1500720">Pixabay</a>',
    }, {
      image: "FAQ/Gamification-card_mnlnvs",
      placeOfUse: "Gamification picture in FAQ",
      link: 'Image from <a href="https://commons.wikimedia.org/wiki/File:Gamification-in-business-illustration-web.jpg">Wiki Commons</a>',
    }, {
      image: "ProfileLeaderboard/first_if1o4v",
      placeOfUse: "1<sup>st</sup> place picture in decks",
      link: 'Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614530">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614530">Pixabay</a>',
    }, {
      image: "ProfileLeaderboard/second_acmj9y",
      placeOfUse: "2<sup>nd</sup> place picture in decks",
      link: 'Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614673">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614673">Pixabay</a>',
    }, {
      image: "ProfileLeaderboard/third_wuqdyl",
      placeOfUse: "3<sup>rd</sup> place picture in decks",
      link: 'Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614844">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1614844">Pixabay</a>',
    }, {
      image: "Achievement/cup-1613315_640_z13mio",
      placeOfUse: "Achievements",
      link: 'Image by <a href="https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1613315">Arek Socha</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1613315">Pixabay</a>',
    }, {
      image: "Error/404_qyc4js",
      placeOfUse: "Error 404",
      link: 'Image by <a href="https://pixabay.com/users/3D_Maennchen-1553824/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2314111">Peggy und Marco Lachmann-Anke</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2314111">Pixabay</a>',
    }, {
      image: "Error/others_fcyqvt",
      placeOfUse: "Other errors",
      link: 'Image by <a href="https://pixabay.com/users/manfredsteger-1848497/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3974187">Manfred Steger</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3974187">Pixabay</a>',
    }, {
      image: "Error/hi_tzo8k1",
      placeOfUse: "Hidden Message",
      link: 'Image by <a href="https://pixabay.com/users/GDJ-1086657/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3791381">Gordon Johnson</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3791381">Pixabay</a>',
    }
  ]

  const formatAsHTMLElement = text => {
    var htmlToReactParser = new HtmlToReactParser();
    return htmlToReactParser.parse(text)
  }

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
                      <th>Picture</th>
                      <th>Used at</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      imagesUsed.map((details, index) => (
                        <tr key={`Images Used number ${index}`}>
                          <td><CloudinaryImage img={details.image} height={30} /></td>
                          <td>{formatAsHTMLElement(details.placeOfUse)}</td>
                          <td>{formatAsHTMLElement(details.link)}</td>
                        </tr>
                      ))
                    }
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