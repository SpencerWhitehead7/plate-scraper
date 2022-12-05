import React from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { authAsyncHandler, userAsyncHandler } from 'reducers/asyncHandlers'
import { selectRouteParams } from 'selectors'
import { FormInputButtonBar, FormSubmit } from 'comps/Form'

const AccountSettings = ({ destroyMe }) => {
  const { formState, handleSubmit, register } = useForm({ mode: `onChange` })

  return (
    <form onSubmit={handleSubmit(({ password }) => { destroyMe(password) })}>
      <FormInputButtonBar
        identifier="password"
        labelText="Confirm with password"
        type="password"
        register={register(`password`, { required: true })}
        errors={formState.errors}
        Button={<FormSubmit formState={formState} value="Destroy (Are you sure? This cannot be undone!)" />}
      />
    </form>
  )
}

const mstp = state => ({
  routeParams: selectRouteParams(state),
})

const mdtp = dispatch => ({
  destroyMe: async (userId, password) => {
    await dispatch(authAsyncHandler.call({ password, isDestroy: true }))
    await dispatch(userAsyncHandler.call(userId))
  },
})

const mergeProps = (sProps, dProps) => {
  const { routeParams: { userId }, ...restSProps } = sProps
  const { destroyMe, ...restDProps } = dProps
  return {
    destroyMe: destroyMe.bind(null, userId),
    ...restSProps,
    ...restDProps,
  }
}

export default connect(mstp, mdtp, mergeProps)(AccountSettings)
