import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler } from 'reducers/asyncHandlers'
import { FormInput, FormSubmit } from 'comps/Form'

import skele from 'skeleton.css'

const AccountSettings = ({ editMe }) => {
  const { errors, formState, handleSubmit, register, watch } = useForm({ mode: `onChange` })

  const onSubmit = ({ email, userName, password, passwordAuth }) => {
    editMe(email, userName, password, passwordAuth)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={skele.column}>
      <div className={skele.row}>
        <FormInput
          identifier="email"
          labelText="New email"
          register={register({ maxLength: 255 })}
          errors={errors}
        />
        <FormInput
          identifier="userName"
          labelText="New username"
          register={register({ maxLength: 32 })}
          errors={errors}
        />
        <FormInput
          identifier="password"
          labelText="New password"
          type="password"
          register={register({ maxLength: 128 })}
          errors={errors}
        />
        <FormInput
          identifier="passwordConfirm"
          labelText="Confirm new password"
          type="password"
          register={register({
            validate: {
              matches: value => value === watch(`password`) || `Passwords must match`,
            },
          })}
          errors={errors}
        />
        <FormInput
          identifier="passwordAuth"
          labelText="Authenticate with current password"
          type="password"
          register={register({ required: true })}
          errors={errors}
        />
      </div>
      <FormSubmit formState={formState} value="Save" />
    </form>
  )
}

const mdtp = dispatch => ({
  editMe: (newEmail, newUserName, newPassword, password) => dispatch(authAsyncHandler.call({ newEmail, newUserName, newPassword, password })),
})

export default connect(null, mdtp)(AccountSettings)
