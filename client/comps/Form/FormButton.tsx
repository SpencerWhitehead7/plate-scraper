import React from 'react'
import { FormState } from 'react-hook-form'
import classnames from 'classnames'

import skele from '@/skeleton.css'

type Props = {
  formState: FormState<{}>
  onClick: VoidFunction
  value: string
}

export const FormButton: React.FC<Props> = ({ formState, onClick, value }) => (
  <button
    type="button"
    onClick={onClick}
    className={classnames({ [skele[`button-primary`]]: formState.isValid })}
  >
    {value}
  </button>
)
