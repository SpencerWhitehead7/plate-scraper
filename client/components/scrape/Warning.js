import React from 'react'

import s from './scrape.css'

const Warning = ({ err }) => (
  <span className={s.warning}>
    {err}
  </span>
)

export default Warning
