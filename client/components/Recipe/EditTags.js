import React from 'react'
import {withRouter} from 'react-router-dom'
import {WithContext as ReactTags} from 'react-tag-input'

const delimiters = {
  comma : 188,
  enter : 13,
  space : 32,
  tab : 9,
}

const EditTags = props => {
  const {tags, setTags} = props

  const handleDelete = i => {
    setTags(tags.filter((_, index) => index !== i))
  }

  const handleAddition = tag => {
    tag.name = tag.name.toLowerCase().replace(/[^a-z]/gi, ``)
    tag.id = tag.id.toLowerCase().replace(/[^a-z]/gi, ``)
    tag.isNew = true // for reconciliation
    // unfortunately, the API seems to lack any way to make this a truly controlled input
    // so cleaning it onsubmit is the best I can do
    setTags([...tags, tag])
  }

  const handleTagClick = i => {
    // TODO create actual search by tag page for this thing to redirect you to
    const name = tags[i].name
    props.history.push(`/searchfortag${name}`)
  }

  return (
    <div>
      <ReactTags
        tags={tags}
        delimiters={Object.values(delimiters)}
        labelField="name"
        handleAddition={handleAddition}
        handleDelete={handleDelete}
        autofocus={false}
        handleTagClick={handleTagClick}
        allowDeleteFromEmptyInput={false}
        inline={false}
        allowDragDrop={false}
      />
    </div>
  )
}

export default withRouter(EditTags)
