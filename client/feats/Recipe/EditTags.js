import React from 'react'
import { withRouter } from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input'

const delimiters = {
  comma: 188,
  enter: 13,
  space: 32,
  tab: 9,
}

const EditTags = ({ history, tags, setTags, originalTags, originalTagSet }) => {
  const tagSet = new Set(tags.map(tag => tag.name))

  const handleDelete = i => {
    tagSet.delete(tags[i].name)
    setTags(tags.filter((_, index) => index !== i))
  }

  const handleAddition = tag => {
    tag.name = tag.name.toLowerCase().replace(/[^a-z]/gi, ``)
    tag.id = tag.id.toLowerCase().replace(/[^a-z]/gi, ``)
    // unfortunately, the API doesn't seem to have a way to make this a truly controlled input, so cleaning it onsubmit is the best I can do
    if (!tagSet.has(tag.name)) { // prevents duplication
      tagSet.add(tag.name)
      if (originalTagSet.has(tag.name)) { // simplifies reconciliation
        setTags([...tags, ...originalTags.filter(originalTag => originalTag.name === tag.name)])
      } else {
        setTags([...tags, tag])
      }
    }
  }

  const handleTagClick = i => {
    // TODO create actual search by tag page for this thing to redirect you to
    const name = tags[i].name
    history.push(`/searchfortag${name}`)
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
