import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { FormAutosizingTextarea, Submit, Warning } from 'comps/Form'
import LoadingIndicator from 'comps/LoadingIndicator'
import { selectScrape } from './selectors'

import s from './RecipeForm.scss'

const RecipeForm = ({ data: recipe, isLoaded, isLoading, error }) => {
  const { errors, formState, handleSubmit, register, watch } = useForm({ mode: `onChange` })

  const onSubmit = ({ text, title }) => {
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

  return (
    isLoading
      ? <LoadingIndicator />
      : recipe ? (
        <form onSubmit={handleSubmit(onSubmit)} className={s.recipeForm}>
          <FormAutosizingTextarea
            identifier="text"
            labelText="Recipe"
            register={register}
            registerOptions={{ required: true }}
            watch={watch}
            errors={errors}
            defaultValue={isLoaded ? recipe.text : ``}
          />

          <label htmlFor="title">
            Filename
            <Warning rhfError={errors.title} />
          </label>
          <div className={s.recipeForm__inputBar}>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={isLoaded ? recipe.title : ``}
              className={s.recipeForm__input}
              ref={register({ required: true })}
            />
            <Submit value="Download!" formState={formState} />
          </div>
        </form>
      )
        : <Warning leftPadded={false} customError={error} />
  )
}

const mstp = state => ({
  ...selectScrape(state),
})

export default connect(mstp, null)(RecipeForm)
