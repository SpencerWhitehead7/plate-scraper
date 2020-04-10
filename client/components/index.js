import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
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

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Scrape} />
        <Route exact path="/me" component={Account} />
        <Route exact path="/user/:userId" component={Account} />
        <Route exact path="/recipe/:recipeId" component={Recipe} />
        <Route render={() => <PageFailure type="404" />} />
      </Switch>
    </BrowserRouter>
  )
}

const mdtp = dispatch => ({
  checkUser: () => dispatch(me()),
})


export default connect(null, mdtp)(Main)
