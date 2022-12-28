import React from "react"

import { ApiTag } from "@/@types/apiContract"

import { Tag } from "./Tag"

type Props = {
  tags: ApiTag[]
}

export const Tags: React.FC<Props> = ({ tags }) => (
  <ul>
    Tags&nbsp;
    {tags && tags.length
      ? tags.map((tag) => <Tag key={tag.name} {...tag} />)
      : "none"}
  </ul>
)
