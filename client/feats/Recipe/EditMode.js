import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { FormAutosizingTextarea, FormEditTags, FormInput, Submit } from 'comps/Form'

const EditMode = ({ recipe, setRecipe, editMode, setEditMode }) => {
  const { errors, formState, handleSubmit, register, watch } = useForm({
    mode: `onChange`,
    defaultValues: {
      title: recipe.title,
      text: recipe.text,
    },
  })

  const [updatedTags, setUpdatedTags] = useState(recipe.tags)
  const originalTagNamesSet = new Set(recipe.tags.map(tag => tag.name))

  const onSubmit = async ({ title, text }) => {
    const updatedTagsSet = new Set(updatedTags.map(tag => tag.name))
    try {
      await Promise.all([
        ...updatedTags.map(tag => (!originalTagNamesSet.has(tag.name)
          ? axios.post(`/api/tag`, { recipeId: recipe.id, name: tag.name })
          : undefined
        )),
        ...recipe.tags.map(tag => (!updatedTagsSet.has(tag.name)
          ? axios.delete(`/api/tag/${recipe.id}/${tag.id}`)
          : undefined
        )),
      ])
      const { data } = await axios.put(`/api/recipe/${recipe.id}`, { title, text })
      setRecipe(data)
      setEditMode(!editMode)
    } catch (err) {
      console.log(err)
    }
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
        originalTags={recipe.tags}
        originalTagNamesSet={originalTagNamesSet}
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
