import { createSelector } from 'reselect'

import { userAsyncHandler } from 'reducers/asyncHandlers'
import { selectMe, selectRouteParams } from 'selectors'

const selectUser = (state, userId) => userAsyncHandler.select(state, userId)
const selectCurrentUser = createSelector(
  state => state,
  selectRouteParams,
  (state, { userId }) => selectUser(state, userId),
)

export const selectCurrentUserIsMine = createSelector(
  selectCurrentUser,
  selectMe,
  (currentUser, me) => currentUser.data && me.data && currentUser.data.id === me.data.id,
)

export const selectMeOrCurrentUser = createSelector(
  selectCurrentUserIsMine,
  selectMe,
  selectCurrentUser,
  (isMine, me, user) => (isMine ? me : user),
)
