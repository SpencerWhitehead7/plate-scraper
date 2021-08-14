import React from 'react'

import s from './ButtonSection.scss'

const ButtonSection = ({ children }) => (
  <div className={s.buttonSection}>
    {children}
  </div>
)

export default ButtonSection
