import React, {useState, useEffect} from 'react'
import axios from 'axios'
import TextAreaAutosize from 'react-textarea-autosize'

import EditTags from './EditTags'

import s from './recipe.css'

const EditMode = props => {
  const {recipe, setRecipe, setEditMode} = props
  const [title, setTitle] = useState(recipe.title)
  const [tags, setTags] = useState(recipe.tags.map(tag => {
    tag.id = String(tag.id)
    return tag
  }))
  // this horrible mapping bs is because the editTags comp requires string IDs
  const [text, setText] = useState(recipe.text)
  const handleSubmit = async () => {
    // send in altered data, setrecipe to new data, flip editmode
    // reconcile the tags so the correct ones are added/deleted
    // if the route doesn't already return the altered recipe, make it so, then use setRecipe with that data
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
    </form>
  </>
  )
}

export default EditMode
