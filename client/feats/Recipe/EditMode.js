import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { FormInput, FormAutosizingTextarea, Submit } from 'comps/Form'
import EditTags from './EditTags'

const EditMode = ({ recipe, setRecipe, editMode, setEditMode }) => {
  const { errors, formState, handleSubmit, register, watch } = useForm({
    mode: `onChange`,
    defaultValues: {
      title: recipe.title,
      text: recipe.text,
    },
  })

  const [tags, setTags] = useState(recipe.tags.map(tag => {
    tag.id = String(tag.id)
    return tag
  }))
  // this horrible mapping bs is because the editTags comp requires string IDs
  const originalTags = recipe.tags.slice()
  const originalTagSet = new Set(originalTags.map(tag => tag.name))
  const onSubmit = async ({ title, text }) => {
    const tagSet = new Set(tags.map(tag => tag.name))
    try {
      await Promise.all([
        ...tags.map(tag => {
          if (!originalTagSet.has(tag.name)) {
            return axios.post(`/api/tag`, { recipeId: recipe.id, name: tag.name })
          } else {
            return undefined
          }
        }),
        ...originalTags.map(tag => {
          if (!tagSet.has(tag.name)) {
            return axios.delete(`/api/tag/${recipe.id}/${tag.id}`)
          } else {
            return undefined
          }
        }),
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
      <label htmlFor="tags">
        Tags
      </label>
      <EditTags
        id="tags"
        tags={tags}
        setTags={setTags}
        originalTags={originalTags}
        originalTagSet={originalTagSet}
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
