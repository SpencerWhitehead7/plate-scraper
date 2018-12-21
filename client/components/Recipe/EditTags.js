import React, {useState} from 'react'
import {WithContext as ReactTags} from 'react-tag-input'

const delimiters = {
  comma : 188,
  enter : 13,
  space : 32,
  tab : 9,
}

const EditTags = props => {
  const {tags, setTags} = props
  const [input, setInput] = useState(``)

  const handleDelete = i => {
    console.log(i)
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = tag => {
    console.log(tag)
    // setState(state => ({tags : [...state.tags, tag]}))
  }

  const handleInputChange = change => {
    // clean the input here
    console.log(change)
  }

  const handleTagClick = i => {
    // send you to the search page for that tag
    console.log(`clicked`)
  }
  console.log(tags)
  return (
    <div>
      <ReactTags
        tags={tags}
        delimiters={Object.values(delimiters)}
        labelField="name"
        handleAddition={handleAddition}
        handleDelete={handleDelete}
        autofocus={false}
        allowDeleteFromEmptyInput={false}
        handleInputChange={handleInputChange}
        inline={false}
        allowDragDrop={false}
      />
    </div>
  )
}

export default EditTags
