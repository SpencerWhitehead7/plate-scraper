import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { authAsyncHandler, recipeAsyncHandler } from 'reducers/asyncHandlers'
import Card, { CardTitle } from 'comps/Card'
import PageFailure from 'feats/PageFailure'
import DispMode from './DispMode'
import EditMode from './EditMode'

const Recipe = ({ fetchRecipe, isMyRecipe, initialRecipe, recipeId }) => {
  const [editMode, setEditMode] = useState(false)
  const [recipe, setRecipe] = useState(initialRecipe)
  useEffect(() => {
    setRecipe(initialRecipe)
  }, [initialRecipe])
  useEffect(() => {
    fetchRecipe(recipeId)
  }, [fetchRecipe, recipeId])

  return (
    recipe ? (
      <Card>
        <CardTitle>{recipe.title}</CardTitle>
        {isMyRecipe && (
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? `Cancel` : `Edit`}
          </button>
        )}
        {
          editMode && isMyRecipe ? ( // undoes edit mode if you log out while on page
            <EditMode
              recipe={recipe}
              setRecipe={setRecipe}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          ) :
            <DispMode recipe={recipe} />
        }
      </Card>
    )
      :
      <PageFailure type="No such recipe" />
  )
}

const mstp = (state, ownProps) => {
  const { recipeId: recipeIdStr } = ownProps.match.params
  const recipeId = Number(recipeIdStr)
  const { data: me } = authAsyncHandler.select(state)
  const { data: recipe } = recipeAsyncHandler.select(state, recipeId)
  const isMyRecipe = recipe && me ? recipe.userId === me.id : false

  return {
    isMyRecipe,
    initialRecipe: recipe,
    recipeId,
  }
}

const mdtp = dispatch => ({
  fetchRecipe: recipeId => dispatch(recipeAsyncHandler.callIfNeeded(recipeId)),
})

export default compose(withRouter, connect(mstp, mdtp))(Recipe)
