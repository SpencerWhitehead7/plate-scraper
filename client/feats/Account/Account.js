import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { authAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import Card, { CardTitle, CardSubtitle } from 'comps/Card'
import LoadingIndicator from 'comps/LoadingIndicator'
import RecipeRows from 'comps/RecipeRows'
import PageFailure from 'feats/PageFailure'
import { selectMeOrCurrentUser, selectCurrentUserIsMine } from './selectors'
import DestroyAccount from './DestroyAccount'
import EditAccount from './EditAccount'

import s from './Account.scss'

const Account = ({ data: user, isLoaded, isLoading, isMine, fetchUser, logout }) => {
  const [section, setSection] = useState(``)

  const { userId } = useParams()
  useEffect(() => {
    fetchUser(userId)
  }, [fetchUser, userId])

  return (
    !isLoaded || isLoading
      ? <LoadingIndicator />
      : user
        ? (
          <>
            <Card>
              <CardTitle>{user.userName}</CardTitle>
              <CardSubtitle>Recipes</CardSubtitle>
              <RecipeRows recipes={user.recipes} />
            </Card>

            {isMine && (
              <Card isLoaded={!isLoading}>
                <CardTitle>Settings</CardTitle>
                <div className={s.settings}>
                  <button
                    type="button"
                    onClick={() => setSection(section === `edit` ? `` : `edit`)}
                  >
                    Edit Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection(section === `destroy` ? `` : `destroy`)}
                  >
                    Destroy Account
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                  >
                    Log out
                  </button>
                </div>
                {section === `edit` && <EditAccount />}
                {section === `destroy` && <DestroyAccount />}
              </Card>
            )}
          </>
        )
        : <PageFailure type="No such user" />
  )
}

const mstp = state => ({
  isMine: selectCurrentUserIsMine(state),
  ...selectMeOrCurrentUser(state),
})

const mdtp = dispatch => ({
  fetchUser: userId => {
    dispatch(userAsyncHandler.callIfNeeded(userId))
  },
  logout: () => {
    dispatch(authAsyncHandler.call({ isLogout: true }))
  },
})

export default connect(mstp, mdtp)(Account)
