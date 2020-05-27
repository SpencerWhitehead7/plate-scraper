import React, { useState, useEffect } from 'react'
import { withRouter, Link, useParams, useLocation } from 'react-router-dom'
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

  useContainer(containerFn)

  return (
    isLoading
      ? <LoadingIndicator /> :
      dataToDisplay ? (
        <>
          <Card>
            <CardTitle>{dataToDisplay.userName}</CardTitle>
            <CardSubtitle>Recipes</CardSubtitle>
            <RecipeRows recipes={dataToDisplay.recipes} />
            <Link to="/user/3">
              to 3
            </Link>

            <Link to="/user/2">
              to 2
            </Link>
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

const useContainer = containerFn => {
  const location = useLocation() // process numbers
  const params = useParams() // process querystring into a real obj with qs, process numbers

  containerFn({ location, params })
}

const containerFn = args => {
  console.log(args)
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

// maybe a use container hook
// it'll get and process the route params and query for you via another hook that uses those hooks
// you'll pass it a function that does all the container stuff your container needs, likely composed of a bunch of react-redux hooks and suchlike
// then it'll just run that and pass it all the params everyone gets.
// If the inner fn needs other params, it can gather them itself
// The useContainer hook will be invoked from a container comp; its return value(s) will be passed to the contained child as props

// maybe make a bunch of reselect-y selector functions with react-redux select hooks/etc?

// Another useAsync stuff hook that will be responsible for kicking off async stuff via useEffect hooks
// useContainer will invoke both performAsync and getProps if necessary, if no async actions depend on route, just getProps
