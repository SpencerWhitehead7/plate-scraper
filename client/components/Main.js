import React from 'react'
import { Route, Switch } from 'react-router-dom'

import FrontPage from './FrontPage'
import Navbar from './Navbar'
import Account from './Account'

const Main = () => (
  <div>
    <Navbar/>
    <Switch>
      <Route exact path="/account" component={Account}/>
      <Route path="/" component={FrontPage}/>
    </Switch>
  </div>
)

export default Main