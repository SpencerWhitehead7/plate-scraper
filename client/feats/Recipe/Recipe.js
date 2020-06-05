import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { recipeAsyncHandler } from 'reducers/asyncHandlers'
import Card, { CardTitle } from 'comps/Card'
import LoadingIndicator from 'comps/LoadingIndicator'
import PageFailure from 'feats/PageFailure'
import { selectCurrentRecipe, selectCurrentRecipeIsMine } from './selectors'
import DispMode from './DispMode'
import EditMode from './EditMode'

const Recipe = ({ data: recipe, isLoaded, isLoading, isMine, deleteRecipe, editRecipe, fetchRecipe }) => {
  const [editMode, setEditMode] = useState(false)

  const { recipeId } = useParams()
  useEffect(() => {
    fetchRecipe(recipeId)
  }, [fetchRecipe, recipeId])

  return (
    !isLoaded || isLoading
      ? <LoadingIndicator />
      : recipe ? (
        <Card>
          <CardTitle>{recipe.title}</CardTitle>
          {isMine && (
            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? `Cancel` : `Edit`}
            </button>
          )}
          {
            editMode ? (
              <EditMode
                recipe={recipe}
                deleteRecipe={deleteRecipe}
                editRecipe={editRecipe}
                setEditMode={setEditMode}
              />
            ) :
              <DispMode recipe={recipe} />
          }
        </Card>
      )
        : <PageFailure type="No such recipe" />
  )
}

const mstp = state => ({
  isMine: selectCurrentRecipeIsMine(state),
  ...selectCurrentRecipe(state),
})


const mdtp = dispatch => ({
  deleteRecipe: recipeId => dispatch(recipeAsyncHandler.call(recipeId, { isDelete: true })),
  editRecipe: (recipeId, newText, newTitle, newTags) => dispatch(recipeAsyncHandler.call(recipeId, { text: newText, title: newTitle, tags: newTags })),
  fetchRecipe: recipeId => dispatch(recipeAsyncHandler.callIfNeeded(recipeId)),
})

export default connect(mstp, mdtp)(Recipe)
