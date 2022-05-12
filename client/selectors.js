import { createSelector } from 'reselect'

import { authAsyncHandler } from 'reducers/asyncHandlers'

export const selectRouteParams = state => state.route.params
export const selectRouteQuery = state => state.route.query

export const selectMe = state => authAsyncHandler.select(state)
export const selectIsAuthed = createSelector(
  selectMe,
  ({ data }) => Boolean(data),
)
