import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { connect } from 'react-redux'

import NavBar from './NavBar'
import Scrape from './scrape'
import Account from './Account'
import Recipe from './Recipe'
import PageFailure from './PageFailure'

import { me } from '../redux/rootReducer'

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


export default hot(connect(null, mdtp)(Main))
