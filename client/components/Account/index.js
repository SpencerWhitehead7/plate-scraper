import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'

import Settings from './Settings'
import PageFailure from '../PageFailure'

import s from './Account.css'

const Account = props => {
  const {me, location} = props
  const endLocation = location.pathname.split(`/`).pop()
  const myPage = endLocation === `me`
  const [showSettings, setShowSettings] = useState(false)
  const [user, setUser] = useState({})
  const fetchUser = async () => {
    try{
      const id = myPage ? me.id : endLocation
      if(id){
        const {data} = await axios.get(`/api/user/${id}`)
        setUser(data)
      }
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {fetchUser()}, [me])


  // console.log(props)
  console.log(user)
  if(myPage && !me.id){
    return <PageFailure type="401"/>
  }else if(!user){
    return <PageFailure type="404"/>
  }else{
    return (
      <main>
        <h1>{user.userName}</h1>
        {myPage &&
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </button>}
        {showSettings && <Settings/>}
        { // replace with an actual recipeRow comp
          user.recipes && user.recipes.map(recipe => <div key={recipe.id}>{recipe.title}</div>)
        }
      </main>
    )
  }
}

// add a 404 option for visiting the page of a user who does not exist

const mstp = state => ({
  me : state.user,
})

export default connect(mstp, null)(withRouter(Account))
