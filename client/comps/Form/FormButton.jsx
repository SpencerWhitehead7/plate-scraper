import React from 'react'
import classnames from 'classnames'

import skele from 'skeleton.css'

const FormButton = ({ formState, onClick, value }) => (
  <button
    type="button"
    onClick={onClick}
    className={classnames({ [skele[`button-primary`]]: formState.isValid })}
  >
    {value}
  </button>
)

export default FormButton
