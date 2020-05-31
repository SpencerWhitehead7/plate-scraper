import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { FormInput, Submit } from 'comps/Form'

const AccountSettings = ({ destroyMe }) => {
  const { errors, formState, handleSubmit, register } = useForm({ mode: `onChange` })

  return (
    <form onSubmit={handleSubmit(({ password }) => { destroyMe(password) })}>
      <FormInput
        identifier="password"
        labelText="Confirm with password"
        type="password"
        register={register({ required: true })}
        errors={errors}
      />
      <Submit formState={formState} value="Destroy (Are you sure? This cannot be undone!)" />
    </form>
  )
}

const mdtp = dispatch => ({
  destroyMe: password => dispatch(authAsyncHandler.call({ password, isDestroy: true })),
})

export default connect(null, mdtp)(AccountSettings)
