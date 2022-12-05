import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { CardTitle } from 'comps/Card'
import { FormInput, FormSubmit } from 'comps/Form'
import { handleCloseModal } from '../modalReducer'

const SignupForm = ({ className, signup }) => {
  const { formState, handleSubmit, register, watch } = useForm({ mode: `onChange` })

  const onSubmit = ({ signupEmail, signupUserName, signupPassword }) => {
    signup(signupEmail, signupUserName, signupPassword)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <CardTitle>Signup</CardTitle>
      <FormInput
        identifier="signupEmail"
        labelText="Email"
        register={register(`signupEmail`, { required: true, maxLength: 255 })}
        errors={formState.errors}
      />
      <FormInput
        identifier="signupUserName"
        labelText="UserName"
        register={register(`signupUserName`, { required: true, maxLength: 32 })}
        errors={formState.errors}
        autoComplete="off"
      />
      <FormInput
        identifier="signupPassword"
        labelText="Password"
        type="password"
        register={register(`signupPassword`, { required: true, maxLength: 64 })}
        errors={formState.errors}
      />
      <FormInput
        identifier="signupPasswordConfirm"
        labelText="Confirm password"
        type="password"
        register={register(`signupPasswordConfirm`, {
          required: `required`,
          validate: {
            matches: value => value === watch(`signupPassword`) || `Passwords must match`,
          },
        })}
        errors={formState.errors}
      />
      <FormSubmit formState={formState} value="Signup" />
    </form>
  )
}

const mdtp = dispatch => ({
  signup: (email, userName, password) => {
    dispatch(handleCloseModal(authAsyncHandler.call({ email, userName, password })))
  },
})

export default connect(null, mdtp)(SignupForm)
