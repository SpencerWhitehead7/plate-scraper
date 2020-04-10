import React from 'react'
import { NavLink } from 'react-router-dom'

import ss from '../../index.css'

const DispMode = ({ recipe }) => (
  <>
    Tags&nbsp;
    {recipe.tags ?
      recipe.tags.map(tag => (
        // TODO create tag searchpage and send redirect there
        <NavLink
          key={tag.id}
          to={`/searchfortag${tag.name}`}
        >
          {`${tag.name} `}
        </NavLink>
      ))
      : `none`}
    <div className={ss.newlineSplit}>
      {recipe.text}
    </div>
  </>
)

export default DispMode
