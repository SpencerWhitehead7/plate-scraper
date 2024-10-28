import { createFileRoute } from "@tanstack/react-router"
import { useParams } from "@tanstack/react-router"
import React, { useState } from "react"

import { useQueryMe, useQueryRecipe } from "@/api"
import { ButtonSection, DownloadButton, ForkButton } from "@/comps/Buttons"
import { Card, CardTitle } from "@/comps/Card"
import { RecipeForm } from "@/comps/Form"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { PageFailure } from "@/comps/PageFailure"
import { Tags } from "@/comps/Tags"
import { PATH } from "@/consts"
import sg from "@/styles/index.module.scss"

export const Recipe: React.FC = () => {
  const { recipeId } = useParams({ from: PATH.recipe })
  const {
    isPending: isPendingRecipe,
    isSuccess: isSuccessRecipe,
    data: dataRecipe,
  } = useQueryRecipe(Number(recipeId))
  const { data: dataMe } = useQueryMe()
  const isMine = dataRecipe && dataMe && dataRecipe.userId === dataMe.id

  const [isEditMode, setIsEditMode] = useState(false)

  return isPendingRecipe ? (
    <LoadingIndicator />
  ) : isSuccessRecipe ? (
    <Card>
      <CardTitle>{dataRecipe.title}</CardTitle>
      <ButtonSection>
        {isMine && (
          <button
            type="button"
            onClick={() => {
              setIsEditMode(!isEditMode)
            }}
          >
            {isEditMode ? "Cancel" : "Edit"}
          </button>
        )}
        {!isEditMode && (
          <DownloadButton text={dataRecipe.text} title={dataRecipe.title} />
        )}
        <ForkButton recipeId={dataRecipe.id} />
      </ButtonSection>
      {isEditMode ? (
        <RecipeForm recipe={dataRecipe} setEditMode={setIsEditMode} />
      ) : (
        <>
          <Tags tags={dataRecipe.tags} />
          <div className={sg.textShowBreaks}>{dataRecipe.text}</div>
        </>
      )}
    </Card>
  ) : (
    <PageFailure type="no recipe" />
  )
}

export const Route = createFileRoute("/recipes/$recipeId")({
  component: Recipe,
})
