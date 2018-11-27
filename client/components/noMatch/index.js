import React from 'react'

import s from './index.css'

const noMatch = () => (
  <div className={s.centerContainer}>
    <h1 className={s.centerText}>
      404 Page Not Found:
      <br/>
      Oh no, there's nothing here!
    </h1>
  </div>
)

export default noMatch
