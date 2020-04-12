import React from 'react'

import Tags from '../../comps/Tags'

import sg from '../../styles/main.scss'

const DispMode = ({ recipe }) => (
  <>
    <Tags tags={recipe.tags} />
    <div className={sg.textShowBreaks}>
      {recipe.text}
    </div>
  </>
)

export default DispMode
