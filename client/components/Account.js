import React from 'react'
import { connect } from 'react-redux'

import RecipesContainer from './RecipesContainer'

class Account extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      filters : [],
      sort : ``,
    }
  }

  render(){
    return (
      <div>
        <h3>Welcome {this.props.user.email}</h3>
        <button type="button">Change Password</button>
        <RecipesContainer recipes={this.props.user.recipes}/>
      </div>
    )
  }
}

const STP = state => ({
  user : state.user,
})

export default connect(STP, null)(Account)