import React from 'react'
import DocumentMeta from 'react-document-meta';

const Error404 = ({
  location: {hash, pathname, search},
}) => {
  return (
    <DocumentMeta title="Page Not Found!">
      <div className="container-fluid wholePageWithNav p-0">
        <div className="row wholePageWithNav justify-content-center align-items-center m-0 p-0">
          <div className="col-sm-4">
            <div>
              <strong>404.</strong>&nbsp;<span className="text-muted">That's an error.</span>
            </div>
            <div>
              The requested URL {pathname}{search}{hash} was not found on this server. That's all we know.
            </div>
          </div>
          <div className="col-sm-3">
            <div><img src="/images/Error/404.jpg" className="w-100" /></div>
          </div>
        </div>
      </div>
    </DocumentMeta>
  )
}

export default Error404;