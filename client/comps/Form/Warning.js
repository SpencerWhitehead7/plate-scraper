import React from 'react'
import classnames from 'classnames'

import sg from 'styles/index.scss'
import s from './Form.scss'

const Warning = ({ leftPadded = true, customError, rhfError }) => (
  customError || rhfError
    ? (
      <span className={classnames(s.form__warning, { [sg.pl_sest]: leftPadded })}>
        {customError ? customError : rhfError.message || rhfError.type}
      </span>
    ) : null
)


export default Warning
