import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import { logout as logoutAction } from 'reducers'
import Card, { CardTitle, CardSubtitle } from 'comps/Card'
import RecipeRows from 'comps/RecipeRows'
import PageFailure from 'feats/PageFailure'
import Settings from './AccountSettings'

const Account = ({ me, location, logout }) => {
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
      <>
        <Card>
          <CardTitle>{user.userName}</CardTitle>
          <CardSubtitle>Recipes</CardSubtitle>
          {user.recipes && <RecipeRows recipes={user.recipes} />}
        </Card>

        {isMyPage && (
          <Card>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
            >
              Settings
            </button>
            <button type="button" onClick={logout}>
              Log out
            </button>
            {showSettings && <Settings />}
          </Card>
        )}
      </>
    )
      :
      <PageFailure type="No such user" />
  )
}

const mstp = state => ({
  me: state.auth.user,
})

const mdtp = dispatch => ({
  logout: () => dispatch(logoutAction()),
})

export default connect(mstp, mdtp)(withRouter(Account))
