import React from 'react'
import { FieldErrorsImpl, RegisterOptions, UseFormRegister } from 'react-hook-form'

import { Warning } from './Warning'

type Props = {
  identifier: string
  labelText: string
  register: UseFormRegister<any>
  registerOptions?: RegisterOptions
  errors: Partial<FieldErrorsImpl>
  type?: React.HTMLInputTypeAttribute
} & React.InputHTMLAttributes<HTMLInputElement>

export const FormInput: React.FC<Props> = ({
  identifier,
  labelText,
  register,
  registerOptions,
  errors = {},
  type = `text`,
  ...restProps
}) => (
  <>
    <label htmlFor={identifier}>
      {labelText}
      <Warning rhfError={errors[identifier]} />
    </label>
    <input
      {...restProps}
      id={identifier}
      type={type}
      {...register(identifier, registerOptions)}
    />
  </>
)
