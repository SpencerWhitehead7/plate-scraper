import { useNavigate } from "@tanstack/react-router"
import React from "react"

import { useMutationForkRecipe, useQueryIsAuthed } from "@/api"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { URL } from "@/consts"
import skele from "@/skeleton.module.css"

type Props = {
  recipeId: number
}

export const ForkButton: React.FC<Props> = ({ recipeId }) => {
  const navigate = useNavigate()

  const isAuthed = useQueryIsAuthed()

  const { mutate: triggerForkRecipe, isPending: isPendingForkRecipe } =
    useMutationForkRecipe()

  return isAuthed ? (
    <button
      type="button"
      onClick={() => {
        triggerForkRecipe(recipeId, {
          onSuccess: (newRecipe) => void navigate(URL.recipe(newRecipe.id)),
        })
      }}
      disabled={isPendingForkRecipe}
      className={skele["button-primary"]}
    >
      {/* todo: apply size */}
      {isPendingForkRecipe ? <LoadingIndicator /> : "Fork"}
    </button>
  ) : null
}
