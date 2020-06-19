import React from 'react'
import { connect } from 'react-redux'

import { recipeAsyncHandler, authAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import { selectIsAuthed } from 'selectors'

import skele from 'skeleton.css'

const ForkButton = ({ recipeId, userId, isAuthed, forkRecipe }) => isAuthed && (
  <button
    type="button"
    onClick={() => { forkRecipe(`fork`, recipeId, userId) }}
    className={skele[`button-primary`]}
  >
    Fork
  </button>
)

const mstp = state => ({
  isAuthed: selectIsAuthed(state),
})

const mdtp = dispatch => ({
  forkRecipe: async (manualKey, recipeId, userId) => {
    await dispatch(recipeAsyncHandler.call(manualKey, { forkId: recipeId }))
    await Promise.all([dispatch(authAsyncHandler.call()), dispatch(userAsyncHandler.call(userId))])
  },
})

export default connect(mstp, mdtp)(ForkButton)
