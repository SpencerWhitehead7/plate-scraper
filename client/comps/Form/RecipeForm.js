import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler, recipeAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import { selectIsAuthed, selectMe } from 'selectors'
import { MODAL_TYPES, openModal as openModalAction } from 'comps/Modal'
import FormAutosizingTextarea from './FormAutosizingTextarea'
import FormButton from './FormButton'
import FormEditTags from './FormEditTags'
import FormInputButtonBar from './FormInputButtonBar'

import skele from 'skeleton.css'
import s from './Form.scss'

const RecipeForm = ({ recipe, data: me, isAuthed, openModal, createRecipe, deleteRecipe, editRecipe }) => {
  const { errors, formState, handleSubmit, register, watch } = useForm({
    mode: `onChange`,
    defaultValues: {
      title: recipe.title,
      text: recipe.text,
    },
  })
  const [updatedTags, setUpdatedTags] = useState((recipe.tags || []).map(({ name }) => name))

  const download = ({ text, title }) => {
    const textAsBlob = new Blob([text], { type: `text/plain` })
    const downloadLink = document.createElement(`a`)
    downloadLink.download = title
    downloadLink.href = window.URL.createObjectURL(textAsBlob)
    downloadLink.onclick = evt => { document.body.removeChild(evt.target) }
    downloadLink.style.display = `none`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    // eslint-disable-next-line no-alert
    alert(`Saved to your default download location`)
  }

  const save = ({ title, text }) => {
    // if the recipe doesn't have an ID, it's being scraped/uploaded; otherwise, it's being edited
    if (recipe.id) {
      editRecipe(recipe.id, recipe.userId, text, title, updatedTags)
    } else {
      createRecipe(`scrape`, me.id, text, title, recipe.sourceSite, recipe.sourceUrl, updatedTags)
    }
  }

  return (
    <form className={s.editMode}>
      {!isAuthed && (
        <button
          type="button"
          className={skele[`button-primary`]}
          onClick={openModal}
        >
          Signup or login to save recipes
        </button>
      )}
      <FormInputButtonBar
        identifier="title"
        labelText="Title / Filename"
        register={register({ required: true })}
        errors={errors}
        Button={(
          <FormButton
            formState={formState}
            value="Download"
            onClick={handleSubmit(download)}
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
        errors={errors}
      />
      <div className={s.form__recipeButtonSection}>
        {recipe.id && (
          <button
            type="button"
            onClick={() => { deleteRecipe(recipe.id, recipe.userId) }}
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

const mstp = state => ({
  ...selectMe(state),
  isAuthed: selectIsAuthed(state),
})

const mdtp = dispatch => ({
  openModal: () => {
    dispatch(openModalAction(MODAL_TYPES.AUTH))
  },
  createRecipe: async (manualKey, userId, text, title, sourceSite, sourceUrl, tags) => {
    await dispatch(recipeAsyncHandler.call(manualKey, { text, title, sourceSite, sourceUrl, tags }))
    await Promise.all([dispatch(authAsyncHandler.call()), dispatch(userAsyncHandler.call(userId))])
    dispatch(recipeAsyncHandler.clear(manualKey))
  },

  deleteRecipe: async (recipeId, userId) => {
    await dispatch(recipeAsyncHandler.call(recipeId, { isDelete: true }))
    await Promise.all([dispatch(authAsyncHandler.call()), dispatch(userAsyncHandler.call(userId))])
  },
  editRecipe: async (recipeId, userId, newText, newTitle, newTags) => {
    await dispatch(recipeAsyncHandler.call(recipeId, { text: newText, title: newTitle, tags: newTags }))
    await Promise.all([dispatch(authAsyncHandler.call()), dispatch(userAsyncHandler.call(userId))])
  },
})

export default connect(mstp, mdtp)(RecipeForm)
