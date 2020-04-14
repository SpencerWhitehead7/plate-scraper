import React from 'react'
import classnames from 'classnames'

import Tags from 'comps/Tags'

import sg from 'styles/index.scss'

const DispMode = ({ recipe }) => (
  <>
    <Tags tags={recipe.tags} />
    <div className={classnames(sg.textShowBreaks, sg.pt_m)}>
      {recipe.text}
    </div>
  </>
)

export default DispMode
