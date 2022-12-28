import classnames from "classnames"
import React, { useState } from "react"

import skele from "@/skeleton.css"
import sg from "@/styles/index.scss"

import { Tag } from "../Tags"

type Props = {
  updatedTags: string[]
  setUpdatedTags: React.Dispatch<string[]>
}

export const FormEditTags: React.FC<Props> = ({
  updatedTags,
  setUpdatedTags,
}) => {
  const [newTag, setNewTag] = useState("")

  const updatedTagsSet = new Set(updatedTags)

  const handleAdd = () => {
    if (newTag && !updatedTagsSet.has(newTag)) {
      setUpdatedTags([...updatedTags, newTag])
      setNewTag("")
    }
  }

  const handleRemove = (name: string) => {
    setUpdatedTags(updatedTags.filter((tagName) => tagName !== name))
  }

  return (
    <div>
      <label htmlFor="tags">Tags</label>
      {Boolean(updatedTags.length) && (
        <ul className={classnames(sg.mt_m, sg.mb_ser)}>
          {updatedTags.map((name) => (
            <Tag key={name} name={name} handleRemove={handleRemove} />
          ))}
        </ul>
      )}
      <input
        id="tags"
        name="tags"
        type="text"
        autoComplete="off"
        value={newTag}
        onKeyDown={(evt) => {
          if (evt.key === "," || evt.key === " ") {
            handleAdd()
          }
        }}
        onChange={(evt) => {
          setNewTag(evt.target.value.toLowerCase().replace(/[^a-z]/gi, ""))
        }}
      />
      <button
        type="button"
        className={classnames({
          [skele["button-primary"]]: newTag && !updatedTagsSet.has(newTag),
        })}
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  )
}
