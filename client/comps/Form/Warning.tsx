import React from 'react'
import classnames from 'classnames'

import s from './Form.scss'

import sg from '@/styles/index.scss'

export const Warning = ({ leftPadded = true, customError = undefined, rhfError = undefined }) => (
  customError || rhfError
    ? (
      <span className={classnames(s.form__warning, { [sg.pl_sest]: leftPadded })}>
        {customError ? customError : rhfError.message || rhfError.type}
      </span>
    )
    : null
)
