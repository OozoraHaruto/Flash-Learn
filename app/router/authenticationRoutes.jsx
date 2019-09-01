// https://blog.bitsrc.io/authen-route-in-react-firebase-5d56dcb1fa37
import React from "react";
import {auth} from 'firebase'

export const authenticatedRoute = redirectPath => WrappedComponent => {
  class AuthenticatedRoute extends React.Component {
    componentDidMount() {
      const { history } = this.props;
      if (!auth.currentUser) {
        console.log("no user")
        return history.push(redirectPath)
      }
    }
    componentDidUpdate(nextProps) {
      const { me, history } = this.props;
      const { me: nextMe } = nextProps;
      if (me && !nextMe) {
        console.log("diff me")
        history.push(redirectPath)
      }
    }
    render() {
      const { me } = this.props;
      if (!me) {
        console.log("need auth no me")
        return null
      }
      return <WrappedComponent {...this.props} />
    }
  }

  return AuthenticatedRoute
}


export const unAuthenticatedRoute = redirectPath => WrappedComponent => {
  class UnAuthenticatedRoute extends React.Component {
    componentDidMount() {
      const { history } = this.props;
      if (auth.currentUser) {
        return history.push(redirectPath)
      }
    }
    componentDidUpdate(nextProps) {
      const { me, history } = this.props;
      const { me: nextMe } = nextProps;
      if (me && !nextMe) {
        console.log("diff me")
        history.push(redirectPath)
      }
    }
    render() {
      const { me } = this.props;
      if (me) {
        console.log("no need auth have me")
        return null
      }
      return <WrappedComponent {...this.props} />
    }
  }

  return UnAuthenticatedRoute
}

