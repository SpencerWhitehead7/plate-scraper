import React from 'react'

import Tags from '../../comps/Tags'

import hc from '../../helperClasses.css'

const DispMode = ({ recipe }) => (
  <>
    <Tags tags={recipe.tags} />
    <div className={hc.newlineSplit}>
      {recipe.text}
    </div>
  </>
)

export default DispMode
