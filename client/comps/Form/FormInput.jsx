import React from 'react'

import Warning from './Warning'

const FormInput = ({
  identifier,
  labelText,
  register,
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
      name={identifier}
      type={type}
      ref={register}
    />
  </>
)

export default FormInput
