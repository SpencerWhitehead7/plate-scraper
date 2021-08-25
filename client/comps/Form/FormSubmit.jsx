import React from 'react'
import classnames from 'classnames'

import skele from 'skeleton.css'

const FormSubmit = ({ formState, value = `Submit` }) => (
  <input
    type="submit"
    className={classnames({ [skele[`button-primary`]]: formState.isValid })}
    value={value}
  />
)

export default FormSubmit
