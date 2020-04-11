import React from 'react'

import s from './Scrape.scss'

const Warning = ({ err }) => (
  <span className={s.warning}>
    {err}
  </span>
)

export default Warning
