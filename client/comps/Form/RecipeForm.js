import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { recipeAsyncHandler } from 'reducers/asyncHandlers'
import { selectIsAuthed } from 'selectors'
import { MODAL_TYPES, openModal as openModalAction } from 'comps/Modal'
import FormAutosizingTextarea from './FormAutosizingTextarea'
import FormButton from './FormButton'
import FormEditTags from './FormEditTags'
import FormInputButtonBar from './FormInputButtonBar'

import skele from 'skeleton.css'
import s from './Form.scss'

// set edit mode means it's on the edit recipe page; otherwise, it's the scrape/create page
// isAuthed indicates where you're logged in; we can assume you're logged in if you're editing
// so those don't need to be checked independently
const RecipeForm = ({ recipe, isAuthed, openModal, createRecipe, deleteRecipe, editRecipe, setEditMode }) => {
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
    if (setEditMode) {
      editRecipe(recipe.id, text, title, updatedTags)
      setEditMode(false)
    } else {
      createRecipe(`new`, text, title, recipe.sourceSite, recipe.sourceUrl, updatedTags)
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
        {setEditMode && (
          <button
            type="button"
            onClick={() => { deleteRecipe(recipe.id) }}
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
  isAuthed: selectIsAuthed(state),
})

const mdtp = dispatch => ({
  openModal: () => dispatch(openModalAction(MODAL_TYPES.AUTH)),
  createRecipe: (manualKey, text, title, sourceSite, sourceUrl, tags) => dispatch(recipeAsyncHandler.call(manualKey, { text, title, sourceSite, sourceUrl, tags })),
  deleteRecipe: recipeId => dispatch(recipeAsyncHandler.call(recipeId, { isDelete: true })),
  editRecipe: (recipeId, newText, newTitle, newTags) => dispatch(recipeAsyncHandler.call(recipeId, { text: newText, title: newTitle, tags: newTags })),
})

export default connect(mstp, mdtp)(RecipeForm)
