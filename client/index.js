import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import NavBar from './feats/Navbar'
import Scrape from './feats/Scrape'
import Account from './feats/Account'
import Recipe from './feats/Recipe'
import PageFailure from './feats/PageFailure'

import store, { me } from './redux'

import 'normalize.css'
import './skeleton.css'

const Main = ({ checkUser }) => {
  useEffect(() => {
    checkUser()
  })
  if (module.hot) module.hot.accept()

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Scrape />
        </Route>
        <Route exact path="/user/:userId">
          <Account />
        </Route>
        <Route exact path="/recipe/:recipeId">
          <Recipe />
        </Route>
        <Route>
          <PageFailure type="404" />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

const mdtp = dispatch => ({
  checkUser: () => dispatch(me()),
})

const WrappedMain = hot(connect(null, mdtp)(Main))


ReactDOM.render(
  <Provider store={store}>
    <WrappedMain />
  </Provider>,
  document.getElementById(`root`),
)
