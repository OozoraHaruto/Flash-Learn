import React from "react";

import Fallback from 'Fallback'

 const dataLoading = (wholePage, loadingMessage) => WrappedComponent =>{
  return class DataLoading extends React.Component{
    render(){
      const { loading } = this.props
      
      if (loading){
        return <Fallback wholePage={wholePage} message={loadingMessage} />
      }
      return <WrappedComponent {...this.props} />
    }
  }
}

export default dataLoading