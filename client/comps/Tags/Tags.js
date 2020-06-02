import React from 'react'
import { Link } from 'react-router-dom'

import s from './Tags.scss'

const Tag = ({ name }) => (
  <Link
    className={s.tags__tag}
    to="/"
  // TODO add "to" for search page for that tag
  >
    {name}
  </Link>
)

const Tags = ({ tags }) => (
  <div className={s.tags}>
    Tags&nbsp;
    {
      tags && tags.length
        ? tags.map(tag => <Tag key={tag.name} {...tag} />)
        : `none`
    }
  </div>
)

export default Tags
