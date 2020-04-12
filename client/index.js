import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'normalize.css'

import store, { me } from 'reducers'
import NavBar from 'feats/Navbar'
import Scrape from 'feats/Scrape'
import Account from 'feats/Account'
import Recipe from 'feats/Recipe'
import PageFailure from 'feats/PageFailure'

import 'skeleton.css'
import 'styles/index.scss'
import s from './App.scss'

const Main = ({ checkUser }) => {
  useEffect(() => {
    checkUser()
  })
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
