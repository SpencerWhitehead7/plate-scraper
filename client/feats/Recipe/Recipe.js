import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { recipeAsyncHandler } from 'reducers/asyncHandlers'
import { DownloadButton, ForkButton } from 'comps/Buttons'
import Card, { CardTitle } from 'comps/Card'
import { RecipeForm } from 'comps/Form'
import LoadingIndicator from 'comps/LoadingIndicator'
import Tags from 'comps/Tags'
import PageFailure from 'feats/PageFailure'
import { selectCurrentRecipe, selectCurrentRecipeIsMine } from './selectors'

import sg from 'styles/index.scss'
import s from './Recipe.scss'

const Recipe = ({ data: recipe, isLoaded, isLoading, isMine, fetchRecipe }) => {
  const [editMode, setEditMode] = useState(false)

  const { recipeId } = useParams()
  useEffect(() => {
    fetchRecipe(recipeId)
  }, [fetchRecipe, recipeId])

  return (
    !isLoaded || isLoading
      ? <LoadingIndicator />
      : recipe
        ? (
          <Card>
            <CardTitle>{recipe.title}</CardTitle>
            <div className={s.recipe__buttonSection}>
              {isMine && (
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? `Cancel` : `Edit`}
                </button>
              )}
              <ForkButton recipeId={recipe.id} userId={recipe.userId} />
              {!editMode && <DownloadButton text={recipe.text} title={recipe.title} />}
            </div>
            {
              editMode
                ? <RecipeForm recipe={recipe} setEditMode={setEditMode} />
                : (
                  <>
                    <Tags tags={recipe.tags} />
                    <div className={classnames(sg.textShowBreaks, sg.pt_m)}>
                      {recipe.text}
                    </div>
                  </>
                )
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
  fetchRecipe: recipeId => {
    dispatch(recipeAsyncHandler.callIfNeeded(recipeId))
  },
})

export default connect(mstp, mdtp)(Recipe)
