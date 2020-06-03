import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormAutosizingTextarea, FormEditTags, FormInput, Submit } from 'comps/Form'

const EditMode = ({ recipe, editRecipe, setEditMode }) => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <Submit value="Save" formState={formState} />
    </form>
  )
}

export default EditMode
