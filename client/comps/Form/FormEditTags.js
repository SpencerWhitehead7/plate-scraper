import React, { useState } from 'react'
import classnames from 'classnames'

import { Tag } from '../Tags'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'
import s from './Form.scss'

// possible delimiters:
// comma: 188
// // enter: 13
// space: 32
// // tab: 9

const FormEditTags = ({ updatedTags, setUpdatedTags, updatedTagsSet }) => {
  const [newTag, setNewTag] = useState(``)

  const handleAdd = () => {
    if (newTag && !updatedTagsSet.has(newTag)) {
      setUpdatedTags([...updatedTags, newTag])
      setNewTag(``)
    }
  }

  const handleRemove = name => {
    setUpdatedTags(updatedTags.filter(tagName => tagName !== name))
  }

  return (
    <div>
      <label htmlFor="tags">
        Tags
      </label>
      {Boolean(updatedTags.length) && (
        <ul className={classnames(sg.mt_m, sg.mb_ser)}>
          {updatedTags.map(name => <Tag key={name} name={name} handleRemove={handleRemove} />)}
        </ul>
      )}
      <input
        id="tags"
        name="tags"
        type="text"
        autoComplete="off"
        value={newTag}
        onKeyDown={evt => { if (evt.keyCode === 188 || evt.keyCode === 32) handleAdd() }}
        onChange={evt => { setNewTag(evt.target.value.toLowerCase().replace(/[^a-z]/gi, ``)) }}
      />
      <button
        type="button"
        className={classnames({ [skele[`button-primary`]]: newTag && !updatedTagsSet.has(newTag) })}
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  )
}

export default FormEditTags
