import React from "react"
import {
  FieldErrorsImpl,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form"

import { Warning } from "@/comps/Form"

import s from "./Form.scss"

type Props = {
  identifier: string
  labelText: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  registerOptions?: RegisterOptions
  errors: Partial<FieldErrorsImpl>
  type?: React.HTMLInputTypeAttribute
  Button: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export const FormInputButtonBar: React.FC<Props> = ({
  identifier,
  labelText,
  register,
  registerOptions,
  errors = {},
  type = "text",
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
        type={type}
        {...register(identifier, registerOptions)}
        className={s.form__inputButtonBarInput}
      />
      {Button}
    </div>
  </>
)
