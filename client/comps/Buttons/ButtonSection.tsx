import React from 'react'

import s from './ButtonSection.scss'

export const ButtonSection = ({ children }) => (
  <div className={s.buttonSection}>
    {children}
  </div>
)
