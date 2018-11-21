import React from 'react'
import {BrowserRouter, Switch, NavLink, Route} from 'react-router-dom'

import {Affix} from 'antd'

import Scrape from './scrape'

const Main = () => (
  <BrowserRouter>
    <React.Fragment>
      <Affix offsetTop="0">
        <nav>
          <NavLink exact to="/">Scrape</NavLink>
        </nav>
      </Affix>
      <Switch>
        <Route exact path="/" component={Scrape}/>
      </Switch>
    </React.Fragment>
  </BrowserRouter>
)

export default Main
