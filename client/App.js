import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch } from 'react-router-dom'

import { PATH } from 'consts'
import { authAsyncHandler } from 'reducers/asyncHandlers'
import Modal from 'comps/Modal'
import SyncedRoute from 'comps/SyncedRoute'
import NavBar from 'feats/Navbar'
import Scrape from 'feats/Scrape'
import Upload from 'feats/Upload'
import Account from 'feats/Account'
import Recipe from 'feats/Recipe'
import Search from 'feats/Search'
import PageFailure from 'feats/PageFailure'

import s from './App.scss'

const Main = ({ fetchMe }) => {
  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return (
    <BrowserRouter>
      <NavBar />
      <main className={s.main}>
        <div className={s.content}>
          <Switch>
            <SyncedRoute exact path={PATH.base}>
              <Scrape />
            </SyncedRoute>
            <SyncedRoute exact path={PATH.scrape}>
              <Scrape />
            </SyncedRoute>
            <SyncedRoute exact path={PATH.upload}>
              <Upload />
            </SyncedRoute>
            <SyncedRoute exact path={PATH.user}>
              <Account />
            </SyncedRoute>
            <SyncedRoute exact path={PATH.recipe}>
              <Recipe />
            </SyncedRoute>
            <SyncedRoute exact path={PATH.search}>
              <Search />
            </SyncedRoute>
            <SyncedRoute>
              <PageFailure type="404" />
            </SyncedRoute>
          </Switch>
        </div>
      </main>
      <Modal />
    </BrowserRouter>
  )
}

const mdtp = dispatch => ({
  fetchMe: () => {
    dispatch(authAsyncHandler.callIfNeeded())
  },
})

export default connect(null, mdtp)(Main)
