import React, { useEffect, useRef } from 'react'

import Warning from './Warning'

import s from './Form.scss'

const FormAutosizingTextarea = ({
  identifier,
  labelText,
  register,
  registerOptions,
  watch,
  errors = {},
  ...restProps
}) => {
  const eleRef = useRef(null)
  const currentValue = watch(identifier)
  const { ref, ...restRegister } = register(identifier, registerOptions)

  useEffect(() => {
    const originalY = window.scrollY
    eleRef.current.style.height = `auto`
    eleRef.current.style.height = `${eleRef.current.scrollHeight + 2}px` // enough to remove scrollbar
    eleRef.current.scrollTop = eleRef.current.scrollHeight
    window.scrollTo(window.scrollLeft, originalY)
    // window scrolls down when you create a new line at bottom of text area
    // but not when you push the bottom down by adding lines in the middle
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
        name={identifier}
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

export default FormAutosizingTextarea
