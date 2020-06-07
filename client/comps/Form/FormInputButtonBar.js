import React from 'react'

import { Warning } from 'comps/Form'

import s from './Form.scss'

const FormInputButtonBar = ({
  identifier,
  labelText,
  register,
  errors = {},
  type = `text`,
  Button,
  ...restProps
}) => (
  <>
    <label htmlFor={identifier}>
      {labelText}
      <Warning rhfError={errors[identifier]} />
    </label>
    <div className={s.form__inputButtonBarContainer}>
      <input
        {...restProps}
        id={identifier}
        name={identifier}
        type={type}
        ref={register}
        className={s.form__inputButtonBarInput}
      />
      {Button}
    </div>
  </>
)


export default FormInputButtonBar
