import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { ButtonSection, DownloadButton, ForkButton } from '@/comps/Buttons'
import { Card, CardTitle } from '@/comps/Card'
import { RecipeForm } from '@/comps/Form'
import { LoadingIndicator } from '@/comps/LoadingIndicator'
import { Tags } from '@/comps/Tags'
import { PageFailure } from '@/feats/PageFailure'
import { useGetMeQuery, useGetRecipeQuery } from '@/reducers'

import sg from '@/styles/index.scss'

export const Recipe = () => {
  const { recipeId } = useParams()
  const { isFetching: isFetchingRecipe, data: dataRecipe } = useGetRecipeQuery({ recipeId: Number(recipeId) })
  const { data: dataMe } = useGetMeQuery()
  const isMine = dataRecipe && dataMe && dataRecipe?.userId === dataMe.id

  const [editMode, setEditMode] = useState(false)

  return (
    isFetchingRecipe
      ? <LoadingIndicator />
      : dataRecipe
        ? (
          <Card>
            <CardTitle>{dataRecipe.title}</CardTitle>
            <ButtonSection>
              {isMine && (
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? `Cancel` : `Edit`}
                </button>
              )}
              {!editMode && <DownloadButton text={dataRecipe.text} title={dataRecipe.title} />}
              <ForkButton recipeId={dataRecipe.id} userId={dataRecipe.userId} />
            </ButtonSection>
            {
              editMode
                ? <RecipeForm recipe={dataRecipe} setEditMode={setEditMode} />
                : (
                  <>
                    <Tags tags={dataRecipe.tags} />
                    <div className={sg.textShowBreaks}>
                      {dataRecipe.text}
                    </div>
                  </>
                )
            }
          </Card>
        )
        : <PageFailure type="No such recipe" />
  )
}
