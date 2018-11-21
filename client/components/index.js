import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {Affix} from 'antd'

import NavBar from './NavBar'
import Scrape from './scrape'
import NoMatch from './noMatch'

const Main = () => (
  <BrowserRouter>
    <React.Fragment>
      <Affix offsetTop={0}>
        <NavBar/>
      </Affix>
      <Switch>
        <Route exact path="/" component={Scrape}/>
        <Route component={NoMatch}/>
      </Switch>
    </React.Fragment>
  </BrowserRouter>
)

export default Main
