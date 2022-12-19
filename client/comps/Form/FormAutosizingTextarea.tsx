import React, { useEffect, useRef } from 'react'
import { FieldErrorsImpl, RegisterOptions, UseFormRegister } from 'react-hook-form'

import { Warning } from './Warning'

import s from './Form.scss'

type Props = {
  identifier: string
  labelText: string
  register: UseFormRegister<any>
  registerOptions?: RegisterOptions
  watch: (fieldName: string) => void // this sucks, but the TS api for RHF is so awkward that it seems there's no better way
  errors: Partial<FieldErrorsImpl>
} & React.HTMLAttributes<HTMLTextAreaElement>

export const FormAutosizingTextarea: React.FC<Props> = ({
  identifier,
  labelText,
  register,
  registerOptions,
  watch,
  errors = {},
  ...restProps
}) => {
  const eleRef = useRef<HTMLTextAreaElement | null>(null)
  const currentValue = watch(identifier)
  const { ref, ...restRegister } = register(identifier, registerOptions)

  useEffect(() => {
    const originalY = window.scrollY
    if (eleRef.current) {
      eleRef.current.style.height = `auto`
      eleRef.current.style.height = `${eleRef.current.scrollHeight + 5}px` // enough to remove scrollbar
      eleRef.current.scrollTop = eleRef.current.scrollHeight
      window.scrollTo(window.scrollX, originalY)
      // window scrolls down when you create a new line at bottom of text area
      // but not when you push the bottom down by adding lines in the middle
    }
  }, [currentValue])

  return (
    <>
      <label htmlFor={identifier}>
        {labelText}
        <Warning rhfError={errors[identifier]} />
      </label>
      <textarea
        {...restProps}
        id={identifier}
        ref={ele => {
          ref(ele)
          eleRef.current = ele
        }}
        {...restRegister}
        className={s.form__autosizingTextarea}
      />
    </>
  )
}
