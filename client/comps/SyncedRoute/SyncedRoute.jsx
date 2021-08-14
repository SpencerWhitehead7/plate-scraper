import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import store from 'reducers'
import { setRouteData } from './routeReducer'

class RouteCore extends Component {
  componentDidMount() {
    this.updateRouteState()
  }

  componentDidUpdate() {
    this.updateRouteState()
  }

  updateRouteState() {
    const { match, location } = this.props
    // if location.pathname === match.url, you are on the most deeply nested route,
    // which guarantees that it will contain ALL the route params
    // search is actually the same on every route, but you might
    // as well update it from the most deeply nested route too
    if (location.pathname === match.url) {
      store.dispatch(setRouteData(match.params, location.search))
    }
  }

  render() {
    return this.props.children
  }
}

const SyncedRoute = ({ children, ...restProps }) => (
  <Route {...restProps}>
    {({ match, location }) => <RouteCore match={match} location={location} children={children} />}
  </Route>
)

export default SyncedRoute
