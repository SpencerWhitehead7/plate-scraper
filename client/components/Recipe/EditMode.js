import React, {useState} from 'react'
import axios from 'axios'
import TextAreaAutosize from 'react-textarea-autosize'

import EditTags from './EditTags'

import s from './recipe.css'

const EditMode = props => {
  const {recipe, setRecipe, editMode, setEditMode} = props
  const [title, setTitle] = useState(recipe.title)
  const [text, setText] = useState(recipe.text)
  const [tags, setTags] = useState(recipe.tags.map(tag => {
    tag.id = String(tag.id)
    return tag
  }))
  // this horrible mapping bs is because the editTags comp requires string IDs
  const originalTags = recipe.tags.slice()
  const originalTagSet = new Set(originalTags.map(tag => tag.name))
  const handleSubmit = async evt => {
    evt.preventDefault()
    const tagSet = new Set(tags.map(tag => tag.name))
    try{
      await Promise.all([
        ...tags.map(tag => {
          if(!originalTagSet.has(tag.name)){
            return axios.post(`/api/tag`, {recipeId : recipe.id, name : tag.name})
          }else{
            return undefined
          }
        }),
        ...originalTags.map(tag => {
          if(!tagSet.has(tag.name)){
            return axios.delete(`/api/tag/${recipe.id}/${tag.id}`)
          }else{
            return undefined
          }
        }),
      ])
      const {data} = await axios.put(`/api/recipe/${recipe.id}`, {title, text})
      setRecipe(data)
      setEditMode(!editMode)
    }catch(err){
      console.log(err)
    }
  }
  return (
  <>
    <form onSubmit={handleSubmit}>
      <label>
      Title:
        <input
          type="text"
          name="title"
          value={title}
          onChange={evt => setTitle(evt.target.value)}
        />
      </label>
      <label>
      Tags:
        <EditTags
          tags={tags}
          setTags={setTags}
          originalTags={originalTags}
          originalTagSet={originalTagSet}
        />
      </label>
      <label>
      Recipe:
        <TextAreaAutosize
          type="text"
          name="text"
          value={text}
          onChange={evt => setText(evt.target.value)}
        />
      </label>
      <button type="submit">
        Save Changes
      </button>
    </form>
  </>
  )
}

export default EditMode
