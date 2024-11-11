import { useNavigate } from "@tanstack/react-router"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { ApiRecipe } from "@/@types/apiContract"
import {
  useMutationCreateRecipe,
  useMutationDeleteRecipe,
  useMutationUpdateRecipe,
  useQueryIsAuthed,
} from "@/api"
import { useCtxModal } from "@/comps/Modal"
import { URL } from "@/consts"
import { downloadRecipe } from "@/helpers"
import skele from "@/skeleton.module.css"

import s from "./Form.module.scss"
import { FormAutosizingTextarea } from "./FormAutosizingTextarea"
import { FormButton } from "./FormButton"
import { FormEditTags } from "./FormEditTags"
import { FormInputButtonBar } from "./FormInputButtonBar"

type Props = {
  recipe: Partial<ApiRecipe>
  setEditMode?: React.Dispatch<boolean>
}

export const RecipeForm: React.FC<Props> = ({ recipe, setEditMode }) => {
  const navigate = useNavigate()

  const { openModalAuth } = useCtxModal()

  const isAuthed = useQueryIsAuthed()

  const { mutate: triggerCreateRecipe } = useMutationCreateRecipe()
  const { mutate: triggerDeleteRecipe } = useMutationDeleteRecipe()
  const { mutate: triggerUpdateRecipe } = useMutationUpdateRecipe()

  const { formState, handleSubmit, register, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      title: recipe.title ?? "",
      text: recipe.text ?? "",
    },
  })
  const [updatedTags, setUpdatedTags] = useState(
    (recipe.tags ?? []).map(({ name }) => name),
  )

  const save = handleSubmit(({ title, text }) => {
    if (recipe.id) {
      // if the recipe has an ID, it must exist and it's being edited
      triggerUpdateRecipe({
        recipeId: recipe.id,
        body: {
          text,
          title,
          tags: updatedTags,
        },
      })
      setEditMode?.(false)
    } else {
      // otherwise, it must be being scraped/uploaded
      triggerCreateRecipe(
        {
          text,
          title,
          sourceSite: recipe.sourceSite,
          sourceUrl: recipe.sourceUrl,
          tags: updatedTags,
        },
        {
          onSuccess: (newRecipe) => void navigate(URL.recipe(newRecipe.id)),
        },
      )
    }
  })

  return (
    <form className={s.editMode}>
      {!isAuthed && (
        <button
          type="button"
          className={skele["button-primary"]}
          onClick={openModalAuth}
        >
          Signup or login to save recipes
        </button>
      )}
      <FormInputButtonBar
        identifier="title"
        labelText="Title / Filename"
        register={register}
        registerOptions={{ required: true }}
        errors={formState.errors}
        Button={
          <FormButton
            formState={formState}
            value="Download"
            onClick={handleSubmit(({ text, title }) => {
              downloadRecipe(text, title)
            })}
          />
        }
        autoComplete="off"
      />
      {isAuthed && (
        <FormEditTags
          updatedTags={updatedTags}
          setUpdatedTags={setUpdatedTags}
        />
      )}
      <FormAutosizingTextarea
        identifier="text"
        labelText="Recipe"
        register={register}
        registerOptions={{ required: true }}
        watch={watch}
        errors={formState.errors}
      />
      <div className={s.form__recipeButtonSection}>
        {recipe.id && (
          <button
            type="button"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              triggerDeleteRecipe(recipe.id!, {
                onSuccess: () => void navigate(URL.recipesAll()),
              })
            }}
          >
            Delete
          </button>
        )}
        {isAuthed && (
          <FormButton formState={formState} value="Save" onClick={save} />
        )}
      </div>
    </form>
  )
}
