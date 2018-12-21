import React from 'react'
import {NavLink} from 'react-router-dom'

import s from './recipe.css'

const DispMode = props => (
  <>
    Tags&nbsp;
    {props.recipe.tags ?
      props.recipe.tags.map(tag => (
        // TODO add "to" for search page for that tag
        // TODO create actual tag comp that deletes tag when clicked (if tag exists) or adds tag to tags (if adding)
        <NavLink
          key={tag.id}
          to="/"
        >
          {`${tag.name} `}
        </NavLink>
      ))
      : `none`
    }
    <div className={s.recipeText}>
      {props.recipe.text}
    </div>
  </>
)

export default DispMode
