import React, { useState } from 'react'
import classnames from 'classnames'

import skele from 'skeleton.css'
import sg from 'styles/index.scss'
import s from './Form.scss'

// possible delimiters:
// comma: 188
// // enter: 13
// space: 32
// // tab: 9

const FormEditTags = ({ updatedTags, setUpdatedTags, originalTags, originalTagNamesSet }) => {
  const tagNamesSet = new Set(updatedTags.map(tag => tag.name))
  const [newTag, setNewTag] = useState(``)

  const handleAdd = () => {
    if (newTag && !tagNamesSet.has(newTag)) { // prevent duplication
      if (originalTagNamesSet.has(newTag)) { // simplify reconciliation
        setUpdatedTags([...updatedTags, ...originalTags.filter(originalTag => originalTag.name === newTag)])
      } else {
        setUpdatedTags([...updatedTags, { name: newTag }])
      }
      setNewTag(``)
    }
  }

  const handleRemove = tagName => { setUpdatedTags(updatedTags.filter(({ name }) => name !== tagName)) }

  const FormTag = ({ tagName }) => (
    <span className={s.form__tag}>
      {tagName}
      <button
        type="button"
        className={s.form__tagX}
        onClick={() => handleRemove(tagName)}
      >
        X
      </button>
    </span>
  )

  return (
    <div>
      <label htmlFor="tags">
        Tags
      </label>
      <div className={classnames(sg.mt_m, sg.mb_ser)}>
        {updatedTags.map(({ name }) => <FormTag key={name} tagName={name} />)}
      </div>
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
        className={classnames({ [skele[`button-primary`]]: newTag && !tagNamesSet.has(newTag) })}
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  )
}

export default FormEditTags
