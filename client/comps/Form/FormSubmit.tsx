import React from 'react'
import { FormState } from 'react-hook-form'
import classnames from 'classnames'

import skele from '@/skeleton.css'

type Props = {
  formState: FormState<{}>
  value?: string
}

export const FormSubmit: React.FC<Props> = ({ formState, value = `Submit` }) => (
  <input
    type="submit"
    className={classnames({ [skele[`button-primary`]]: formState.isValid })}
    disabled={!formState.isValid || formState.isSubmitting}
    value={value}
  />
)
