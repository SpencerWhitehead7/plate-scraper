import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import Settings from './Settings'
import RecipeRow from '../shared/RecipeRow'
import PageFailure from '../PageFailure'

const Account = ({ me, location }) => {
  const id = location.pathname.split(`/`).pop()
  const isMyPage = Number(id) === me.id
  const [showSettings, setShowSettings] = useState(false)
  const [user, setUser] = useState({})
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/${id}`)
        setUser(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [me, id])

  return (
    user ? (
      <main>
        <h1>{user.userName}</h1>
        {isMyPage && (
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings
          </button>
        )}
        {showSettings && <Settings />}
        {user.recipes && user.recipes.map(recipe => <RecipeRow key={recipe.id} {...recipe} />)}
      </main>
    )
      :
      <PageFailure type="404" />
  )
}

const mstp = state => ({
  me: state.user,
})

export default connect(mstp, null)(withRouter(Account))
