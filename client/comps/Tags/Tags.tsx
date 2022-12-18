import React from 'react'

import { Tag } from './Tag'

export const Tags = ({ tags }) => (
  <ul>
    Tags&nbsp;
    {
      tags && tags.length
        ? tags.map(tag => <Tag key={tag.name} {...tag} />)
        : `none`
    }
  </ul>
)
