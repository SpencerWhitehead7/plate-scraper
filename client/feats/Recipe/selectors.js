import { createSelector } from '@reduxjs/toolkit'

import { recipeAsyncHandler } from 'reducers/asyncHandlers'
import { selectMe, selectRouteParams } from 'selectors'

const selectRecipe = (state, userId) => recipeAsyncHandler.select(state, userId)
export const selectCurrentRecipe = createSelector(
  state => state,
  selectRouteParams,
  (state, { recipeId }) => selectRecipe(state, recipeId),
)

export const selectCurrentRecipeIsMine = createSelector(
  selectCurrentRecipe,
  selectMe,
  (currentRecipe, me) => currentRecipe.data && me.data && currentRecipe.data.userId === me.data.id,
)
