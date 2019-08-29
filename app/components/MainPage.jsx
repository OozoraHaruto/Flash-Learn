import React from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';

export class MainPage extends React.Component{
  render(){
    var meta = {
      title: "Home"
    }

    return(
      <DocumentMeta {...meta}>
        <div>Hello</div>
      </DocumentMeta>
    )
  }
}

export default MainPage;
