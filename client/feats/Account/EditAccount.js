import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import { selectRouteParams } from 'selectors'
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
          register={register({ maxLength: 64 })}
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

const mstp = state => ({
  routeParams: selectRouteParams(state),
})

const mdtp = dispatch => ({
  editMe: async (userId, newEmail, newUserName, newPassword, password) => {
    await dispatch(authAsyncHandler.call({ newEmail, newUserName, newPassword, password }))
    await dispatch(userAsyncHandler.call(userId))
  },
})

const mergeProps = (sProps, dProps) => {
  const { routeParams: { userId }, ...restSProps } = sProps
  const { editMe, ...restDProps } = dProps
  return {
    editMe: editMe.bind(null, userId),
    ...restSProps,
    ...restDProps,
  }
}

export default connect(mstp, mdtp, mergeProps)(AccountSettings)
