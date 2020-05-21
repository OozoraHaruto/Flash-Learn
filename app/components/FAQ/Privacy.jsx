import React, { useEffect } from 'react'
import DocumentMeta from 'react-document-meta';
import { FaBars } from "react-icons/fa";

const PrivacyPolicy = () => {
  useEffect(() => {
    var hash = document.location.hash
    if (hash != "") {
      $('a[href="' + hash + '"]').tab('show')
    }
  }, [])

  return (
    <DocumentMeta title="FAQ - Decks">
      <div className='container my-3'>
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-pills" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="how-to-create-tab" data-toggle="pill" href="#how-to-create" role="tab" aria-controls="how-to-create" aria-selected="true">What is stored and used?</a>
              </li>
            </ul>
          </div>
          <div className="card-body tab-content">
            <div className="tab-pane fade show active" id="how-to-create" role="tabpanel" aria-labelledby="how-to-create-tab">
              The backend of this system uses Google's database, this includes the authentication (user account's) and the data.<br />
              Do read Google's Privacy policy for those.<br />
              <ul>
                <li><a href="https://firebase.google.com/policies/analytics">Google Analytics for Firebase Use Policy</a></li>
                <li><a href="https://firebase.google.com/support/privacy">Privacy and Security in Firebase</a></li>
              </ul>
              The personal information asked are stored in the data base whilst the password is stored seperately and cannot be seen even by the developer.<br />
              Any other data is stored in the normal database including the user's name.<br />
              This website does not specifically track you as it is purely a learning website.<br />
              <br />
              To ensure quick access to tests the data are stored locally during the session (until the user close/refresh the tab).
              Any other data is handled by google's authentication platform (e.g. session cookies, authentication).
            </div>
          </div>
        </div>
      </div>
    </DocumentMeta>
  )
}

export default PrivacyPolicy
