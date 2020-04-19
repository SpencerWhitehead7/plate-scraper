import React from 'react'

import s from './Warning.scss'

const Warning = ({ error }) => (
  <span className={s.warning}>
    {error}
  </span>
)

export default Warning
