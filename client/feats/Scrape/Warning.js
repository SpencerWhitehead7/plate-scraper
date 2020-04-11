import React from 'react'

import s from './Warning.scss'

const Warning = ({ err }) => (
  <span className={s.warning}>
    {err}
  </span>
)

export default Warning
