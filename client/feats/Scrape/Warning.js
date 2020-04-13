import React from 'react'

import s from './Warning.scss'

const Warning = ({ message }) => (
  <span className={s.warning}>
    {message}
  </span>
)

export default Warning
