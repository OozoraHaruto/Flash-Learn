import React, { useEffect } from 'react'
import DocumentMeta from 'react-document-meta';
var HtmlToReactParser = require('html-to-react').Parser;


const Other = ({
  location: { state },
}) => {
  const syntaxHighlight = (json) => { //https://stackoverflow.com/a/7220510/1092339
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
  const renderJSON = () => {
    var htmlToReactParser = new HtmlToReactParser();
    var reactElement = htmlToReactParser.parse(syntaxHighlight(state));

    return reactElement;
  }

  return (
    <DocumentMeta title={state ? `Error${state.message && `, ${state.message}`}` : "(о´ I `)y━~~~.oO(ｺﾝﾇﾂﾞﾜ★)"}>
      <div className="container-fluid wholePageWithNav p-0">
        <div className="row wholePageWithNav justify-content-center align-items-center m-0 p-0">
          {
            state &&
            <React.Fragment>
              <div className="col-sm-3">
                <div><img src="/images/Error/others.png" className="w-100" /></div>
              </div>
              <div className="col-sm-4">
                <div className="mb-3">
                  <strong>An error has occurred.&nbsp;</strong><span className="text-muted">If the problem persists please contact us.</span>
                </div>
                {state.message && <div>Message: {state.message}</div>}
                <div className="mb-3">
                  <details>
                    <summary>Error Details</summary>
                    <pre className="pre-scrollable"><code class="jsonFormat">{renderJSON()}</code></pre>
                  </details>
                </div>
                <div>
                  <a href={`mailto:taiyoozoraapp@gmail.com?subject=Bug in FlashCard (Website)&body=Steps to Replicate:%0A[Replace here]%0A%0AError:%0A${JSON.stringify(state, undefined, 2)}`} className="btn btn-primary">Contact Us</a>
                </div>
              </div>
            </React.Fragment>
          }
          {
            !state &&
            <React.Fragment>
              <div className="col-sm-4">
                <div>
                  <h4 className="d-inline">Look what we have here.&nbsp;</h4><small className="text-muted">ฅ•ω•ฅﾆｬﾆｬｰﾝ✧</small>
                </div>
                <div>Have a nice day. ´ ³`)ﾉ ～♡じゃあね〜</div>
              </div>
              <div className="col-sm-3">
                <div><img src="/images/Error/hi.png" className="w-100" /></div>
              </div>
            </React.Fragment>
          }
        </div>
      </div>
    </DocumentMeta>
  )
}

export default Other