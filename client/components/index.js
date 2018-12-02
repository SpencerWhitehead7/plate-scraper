import React, {useEffect} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import NavBar from './NavBar'
import Scrape from './scrape'
import NoMatch from './noMatch'

import {me} from '../redux/rootReducer'

const Main = props => {
  useEffect(() => {
    props.checkUser()
  })

  return (
    <BrowserRouter>
    <>
      <NavBar/>
      <Switch>
        <Route exact path="/" component={Scrape}/>
        <Route component={NoMatch}/>
      </Switch>
    </>
    </BrowserRouter>
  )
}

const mdtp = dispatch => ({
  checkUser : () => dispatch(me()),
})


export default connect(null, mdtp)(Main)
