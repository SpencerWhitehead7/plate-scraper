import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { openAuthModal as openAuthModalAction } from '@/comps/Modal'
import { URL } from '@/consts'
import { downloadRecipe } from '@/helpers'
import { useAppDispatch, useCreateRecipeMutation, useDeleteRecipeMutation, useEditRecipeMutation, useGetMeQuery, useSelectIsAuthed } from '@/reducers'

import { FormAutosizingTextarea } from './FormAutosizingTextarea'
import { FormButton } from './FormButton'
import { FormEditTags } from './FormEditTags'
import { FormInputButtonBar } from './FormInputButtonBar'

import skele from '@/skeleton.css'

import s from './Form.scss'

export const RecipeForm = ({ recipe, setEditMode = (x) => x }) => {
  const navigate = useNavigate()

  const { data: dataMe } = useGetMeQuery()
  const isAuthed = useSelectIsAuthed()

  const dispatch = useAppDispatch()
  const openAuthModal = () => { dispatch(openAuthModalAction()) }

  const [triggerCreateRecipe, stateCreateRecipe] = useCreateRecipeMutation()
  const [triggerDeleteRecipe, stateDeleteRecipe] = useDeleteRecipeMutation()
  const [triggerEditRecipe, stateEditRecipe] = useEditRecipeMutation()

  const { formState, handleSubmit, register, reset, watch } = useForm({
    mode: `onChange`,
    defaultValues: {
      title: recipe.title,
      text: recipe.text,
    },
  })
  const [updatedTags, setUpdatedTags] = useState((recipe.tags ?? []).map(({ name }) => name))

  const save = async ({ title, text }) => {
    if (recipe.id) {
      // if the recipe has an ID, it must exist and it's being edited
      await triggerEditRecipe({ recipeId: recipe.id, userId: recipe.userId, text, title, tags: updatedTags })
      setEditMode(false)
    } else {
      // otherwise, it must be being scraped/uploaded
      triggerCreateRecipe({ userId: dataMe.id, text, title, sourceSite: recipe.sourceSite, sourceUrl: recipe.sourceUrl, tags: updatedTags })
    }
    if (recipe.sourceSite === `upload` && recipe.sourceUrl === `upload`) {
      setUpdatedTags([])
      reset()
    }
  }

  return (
    <form className={s.editMode}>
      {!isAuthed && (
        <button
          type="button"
          className={skele[`button-primary`]}
          onClick={openAuthModal}
        >
          Signup or login to save recipes
        </button>
      )}
      <FormInputButtonBar
        identifier="title"
        labelText="Title / Filename"
        register={register(`title`, { required: true })}
        errors={formState.errors}
        Button={(
          <FormButton
            formState={formState}
            value="Download"
            onClick={handleSubmit(({ text, title }) => {
              downloadRecipe(text, title)
            })}
          />
        )}
        autoComplete="off"
      />
      {isAuthed && (
        <FormEditTags
          updatedTags={updatedTags}
          setUpdatedTags={setUpdatedTags}
          updatedTagsSet={new Set(updatedTags)}
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
              await triggerDeleteRecipe({ recipeId: recipe.id, userId: recipe.userId })
              if (stateDeleteRecipe.isSuccess) {
                navigate(URL.search())
              }
            }}
          >
            Delete
          </button>
        )}
        {isAuthed && (
          <FormButton
            formState={formState}
            value="Save"
            onClick={handleSubmit(save)}
          />
        )}
      </div>
    </form>
  )
}
