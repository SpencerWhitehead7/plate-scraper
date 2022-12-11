import React from 'react'
import { useForm } from 'react-hook-form'

import { CardTitle } from '@/comps/Card'
import { FormInput, FormSubmit } from '@/comps/Form'
import { useAppDispatch, useLoginMutation } from '@/reducers'

import { closeModal } from '../modalReducer'

export const LoginForm = ({ className }) => {
  const dispatch = useAppDispatch()

  const [triggerLogin] = useLoginMutation()

  const { formState, handleSubmit, register } = useForm({ mode: `onChange` })

  const onSubmit = handleSubmit(async ({ loginEmail, loginPassword }) => {
    await triggerLogin({ email: loginEmail, password: loginPassword })
    dispatch(closeModal())
  })

  return (
    <form onSubmit={onSubmit} className={className}>
      <CardTitle>Login</CardTitle>
      <FormInput
        identifier="loginEmail"
        labelText="Email"
        register={register(`loginEmail`, { required: true })}
        errors={formState.errors}
      />
      <FormInput
        identifier="loginPassword"
        labelText="Password"
        type="password"
        register={register(`loginPassword`, { required: true })}
        errors={formState.errors}
      />
      <FormSubmit formState={formState} value="Login" />
    </form>
  )
}
