// https://blog.bitsrc.io/authen-route-in-react-firebase-5d56dcb1fa37
import React from "react";
import {auth} from 'firebase'

export const authenticatedRoute = redirectPath => WrappedComponent => {
  class AuthenticatedRoute extends React.Component {
    componentDidMount() {
      const { history } = this.props;
      if (!auth.currentUser) {
        return redirectWithCurrentRoute(history, redirectPath)
      }
    }
    componentDidUpdate(nextProps) {
      const { me, history } = this.props;
      const { me: nextMe } = nextProps;
      if (me && !nextMe) {
        redirectWithCurrentRoute(history, redirectPath)
      }
    }
    render() {
      const { me } = this.props;
      if (!me) {
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
        return redirectWithCurrentRoute(history, redirectPath)
      }
    }
    componentDidUpdate(nextProps) {
      const { me, history } = this.props;
      const { me: nextMe } = nextProps;
      if (me && !nextMe) {
        redirectWithCurrentRoute(history, redirectPath)
      }
    }
    render() {
      const { me } = this.props;
      if (me) {
        return null
      }
      return <WrappedComponent {...this.props} />
    }
  }

  return UnAuthenticatedRoute
}


const redirectWithCurrentRoute = (history, redirectPath) =>{
  history.push({
    ...redirectPath,
    state: { from: history.location.pathname },
  })
}
