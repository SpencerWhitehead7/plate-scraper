import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormAutosizingTextarea, FormEditTags, FormInput, FormSubmit } from 'comps/Form'

import s from './EditMode.scss'

const EditMode = ({ recipe, deleteRecipe, editRecipe, setEditMode }) => {
  const { errors, formState, handleSubmit, register, watch } = useForm({
    mode: `onChange`,
    defaultValues: {
      title: recipe.title,
      text: recipe.text,
    },
  })
  const [updatedTags, setUpdatedTags] = useState(recipe.tags.map(({ name }) => name))

  const onSubmit = ({ title, text }) => {
    editRecipe(recipe.id, text, title, updatedTags)
    setEditMode(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.editMode}>
      <FormInput
        identifier="title"
        labelText="Title"
        register={register({ required: true })}
        errors={errors}
      />
      <FormEditTags
        updatedTags={updatedTags}
        setUpdatedTags={setUpdatedTags}
        updatedTagsSet={new Set(updatedTags)}
      />
      <FormAutosizingTextarea
        identifier="text"
        labelText="Recipe"
        register={register}
        registerOptions={{ required: true }}
        watch={watch}
        errors={errors}
      />
      <div className={s.editMode__buttonSection}>
        <button type="button" onClick={() => { deleteRecipe(recipe.id) }}>Delete recipe</button>
        <FormSubmit formState={formState} value="Save" />
      </div>
    </form>
  )
}

export default EditMode
