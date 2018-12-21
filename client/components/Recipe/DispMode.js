import React from 'react'
import {NavLink} from 'react-router-dom'

import s from './recipe.css'

const DispMode = props => (
  <>
    Tags&nbsp;
    {props.recipe.tags ?
      props.recipe.tags.map(tag => (
        // TODO create tag searchpage and send redirect there
        <NavLink
          key={tag.id}
          to={`/searchfortag${tag.name}`}
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
