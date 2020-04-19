import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { authAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import Card, { CardTitle, CardSubtitle } from 'comps/Card'
import RecipeRows from 'comps/RecipeRows'
import PageFailure from 'feats/PageFailure'
import Settings from './AccountSettings'

const Account = ({ fetchUser, isMyPage, logout, user, userId }) => {
  const [showSettings, setShowSettings] = useState(false)
  useEffect(() => {
    fetchUser(userId)
  }, [userId, fetchUser])

  return (
    user ? (
      <>
        <Card>
          <CardTitle>{user && user.userName}</CardTitle>
          <CardSubtitle>Recipes</CardSubtitle>
          {user && user.recipes && <RecipeRows recipes={user.recipes} />}
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

const mstp = (state, ownProps) => {
  const { userId: userIdStr } = ownProps.match.params
  const userId = Number(userIdStr)
  const { data: me } = authAsyncHandler.select(state)
  const { data: user } = userAsyncHandler.select(state, userId)
  const isMyPage = userId === (me ? me.id : me)

  return {
    isMyPage,
    user,
    userId,
  }
}

const mdtp = dispatch => ({
  fetchUser: id => dispatch(userAsyncHandler.callIfNeeded(id)),
  logout: () => dispatch(authAsyncHandler.call({ isLogout: true })),
})

export default compose(withRouter, connect(mstp, mdtp))(Account)
