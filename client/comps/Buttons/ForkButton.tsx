import React from 'react'

import { LoadingIndicator } from '@/comps/LoadingIndicator'
import { useForkRecipeMutation, useSelectIsAuthed } from '@/reducers'

import skele from '@/skeleton.css'

type Props = {
  recipeId: number
  userId: number
}

export const ForkButton: React.FC<Props> = ({ recipeId, userId }) => {
  const isAuthed = useSelectIsAuthed()

  const [triggerForkRecipe, stateForkRecipe] = useForkRecipeMutation()
  const { isLoading } = stateForkRecipe

  return isAuthed ? (
    isLoading
      ? <LoadingIndicator /> // todo: apply size
      : <button
        type="button"
        onClick={() => { triggerForkRecipe({ recipeId, userId }) }}
        className={skele[`button-primary`]}
      >
        Fork
      </button>
  ) : null
}
