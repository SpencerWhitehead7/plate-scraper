import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { CardTitle } from 'comps/Card'
import { FormInput, Submit } from 'comps/Form'
import { handleCloseModal } from '../modalReducer'

const LoginForm = ({ className, login }) => {
  const { errors, formState, handleSubmit, register } = useForm({ mode: `onChange` })

  const onSubmit = ({ loginEmail, loginPassword }) => {
    login(loginEmail, loginPassword)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <CardTitle>Login</CardTitle>
      <FormInput
        identifier="loginEmail"
        labelText="Email"
        register={register({ required: true })}
        errors={errors}
      />
      <FormInput
        identifier="loginPassword"
        labelText="Password"
        type="password"
        register={register({ required: true })}
        errors={errors}
      />
      <Submit formState={formState} value="Login" />
    </form>
  )
}

const modalSubmitThunk = (email, password, dispatch) => {
  dispatch(authAsyncHandler.call({ email, password }))
}

const mdtp = dispatch => ({
  login: (email, password) => dispatch(handleCloseModal(modalSubmitThunk.bind(null, email, password))),
})

export default connect(null, mdtp)(LoginForm)
