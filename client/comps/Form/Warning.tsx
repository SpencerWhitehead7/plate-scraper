import React from 'react'
import { FieldError } from 'react-hook-form'
import classnames from 'classnames'

import s from './Form.scss'

import sg from '@/styles/index.scss'

type Props = {
  leftPadded?: boolean
  rhfError?: Partial<FieldError>
  customError?: string
}

export const Warning: React.FC<Props> = ({ leftPadded = true, customError, rhfError }) => (
  customError || rhfError
    ? (
      <span className={classnames(s.form__warning, { [sg.pl_sest]: leftPadded })}>
        {customError
          ? customError
          : rhfError!.message || rhfError!.type}
      </span>
    )
    : null
)
