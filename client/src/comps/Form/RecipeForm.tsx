import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { ApiRecipe } from "@/@types/apiContract"
import { openAuthModal as openAuthModalAction } from "@/comps/Modal"
import { URL } from "@/consts"
import { downloadRecipe } from "@/helpers"
import {
  useAppDispatch,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
  useGetMeQuery,
  useSelectIsAuthed,
} from "@/reducers"
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

  const { data: dataMe } = useGetMeQuery()
  const isAuthed = useSelectIsAuthed()

  const dispatch = useAppDispatch()
  const openAuthModal = () => {
    dispatch(openAuthModalAction())
  }

  const [triggerCreateRecipe] = useCreateRecipeMutation()
  const [triggerDeleteRecipe] = useDeleteRecipeMutation()
  const [triggerEditRecipe] = useEditRecipeMutation()

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

  const save = handleSubmit(async ({ title, text }) => {
    if (!dataMe) return

    if (recipe.id) {
      // if the recipe has an ID, it must exist and it's being edited
      await triggerEditRecipe({
        recipeId: recipe.id,

        userId: dataMe.id,
        text,
        title,
        tags: updatedTags,
      })
      setEditMode?.(false)
    } else {
      // otherwise, it must be being scraped/uploaded
      const newRecipe = await triggerCreateRecipe({
        userId: dataMe.id,
        text,
        title,
        sourceSite: recipe.sourceSite ?? "",
        sourceUrl: recipe.sourceUrl ?? "",
        tags: updatedTags,
      }).unwrap()
      navigate(URL.recipe(newRecipe.id))
    }
  })

  return (
    <form className={s.editMode}>
      {!isAuthed && (
        <button
          type="button"
          className={skele["button-primary"]}
          onClick={openAuthModal}
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
            onClick={async () => {
              await triggerDeleteRecipe({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                recipeId: recipe.id!,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                userId: recipe.userId!,
              })
              navigate(URL.search())
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
