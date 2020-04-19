import React, { useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import Modal from 'comps/Modal'
import NavBar from 'feats/Navbar'
import Scrape from 'feats/Scrape'
import Account from 'feats/Account'
import Recipe from 'feats/Recipe'
import PageFailure from 'feats/PageFailure'

import s from './App.scss'

const Main = ({ fetchMe }) => {
  useEffect(() => {
    fetchMe()
  }, [fetchMe])
  if (module.hot) module.hot.accept()

  return (
    <BrowserRouter>
      <NavBar />
      <main className={s.main}>
        <div className={s.content}>
          <Switch>
            <Route exact path="/">
              <Scrape />
            </Route>
            <Route exact path="/scrape/:scrapeMethod">
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
        </div>
      </main>
      <Modal />
    </BrowserRouter>
  )
}

const mdtp = dispatch => ({
  fetchMe: () => dispatch(authAsyncHandler.callIfNeeded()),
})

export default hot(connect(null, mdtp)(Main))
