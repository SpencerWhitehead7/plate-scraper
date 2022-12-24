import React from 'react'
import { useForm } from 'react-hook-form'

import { CardTitle } from '@/comps/Card'
import { FormInput, FormSubmit } from '@/comps/Form'
import { useAppDispatch, useSignupMutation } from '@/reducers'

import { closeModal } from '../modalReducer'

type Props = {
  className?: string
}

export const SignupForm: React.FC<Props> = ({ className = `` }) => {
  const dispatch = useAppDispatch()

  const [triggerSignup] = useSignupMutation()

  const { formState, handleSubmit, register, watch } = useForm({
    mode: `onChange`,
    defaultValues: {
      signupEmail: "",
      signupUserName: "",
      signupPassword: "",
    }
  })

  const onSubmit = handleSubmit(async ({ signupEmail, signupUserName, signupPassword }) => {
    await triggerSignup({ email: signupEmail, userName: signupUserName, password: signupPassword })
    dispatch(closeModal())
  })

  return (
    <form onSubmit={onSubmit} className={className}>
      <CardTitle>Signup</CardTitle>
      <FormInput
        identifier="signupEmail"
        labelText="Email"
        register={register}
        registerOptions={{ required: true, maxLength: 255 }}
        errors={formState.errors}
      />
      <FormInput
        identifier="signupUserName"
        labelText="UserName"
        register={register}
        registerOptions={{ required: true, maxLength: 32 }}
        errors={formState.errors}
        autoComplete="off"
      />
      <FormInput
        identifier="signupPassword"
        labelText="Password"
        type="password"
        register={register}
        registerOptions={{ required: true, maxLength: 64 }}
        errors={formState.errors}
      />
      <FormInput
        identifier="signupPasswordConfirm"
        labelText="Confirm password"
        type="password"
        register={register}
        registerOptions={{
          required: true,
          validate: {
            matches: value => value === watch(`signupPassword`) || `Passwords must match`,
          },
        }}
        errors={formState.errors}
      />
      <FormSubmit formState={formState} value="Signup" />
    </form>
  )
}
