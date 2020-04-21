import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { authAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import Card, { CardTitle, CardSubtitle } from 'comps/Card'
import LoadingIndicator from 'comps/LoadingIndicator'
import RecipeRows from 'comps/RecipeRows'
import PageFailure from 'feats/PageFailure'
import DestroyAccount from './DestroyAccount'
import EditAccount from './EditAccount'

const Account = ({ dataToDisplay, fetchUser, isLoading, isMyPage, logout, userId }) => {
  const [showEditAccount, setShowEditAccount] = useState(false)
  const [showDestroyAccont, setShowDestroyAccount] = useState(false)
  useEffect(() => {
    fetchUser(userId)
  }, [userId, fetchUser])

  return (
    isLoading
      ? <LoadingIndicator /> :
      dataToDisplay ? (
        <>
          <Card>
            <CardTitle>{dataToDisplay.userName}</CardTitle>
            <CardSubtitle>Recipes</CardSubtitle>
            <RecipeRows recipes={dataToDisplay.recipes} />
          </Card>

          {isMyPage && (
            <Card>
              <button
                type="button"
                onClick={() => setShowEditAccount(!showEditAccount)}
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() => setShowDestroyAccount(!showDestroyAccont)}
              >
                Destroy Account
              </button>
              <button type="button" onClick={logout}>
                Log out
              </button>
              {showEditAccount && <EditAccount />}
              {showDestroyAccont && <DestroyAccount />}
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
  const { data: me, isLoading: meIsLoading } = authAsyncHandler.select(state)
  const { data: user, isLoading: userIsLoading } = userAsyncHandler.select(state, userId)
  const isLoading = meIsLoading || userIsLoading
  const isMyPage = userId === (me ? me.id : me)
  const dataToDisplay = isMyPage ? me : user

  return {
    dataToDisplay,
    isLoading,
    isMyPage,
    userId,
  }
}

const mdtp = dispatch => ({
  fetchUser: id => dispatch(userAsyncHandler.callIfNeeded(id)),
  logout: () => dispatch(authAsyncHandler.call({ isLogout: true })),
})

export default compose(withRouter, connect(mstp, mdtp))(Account)
