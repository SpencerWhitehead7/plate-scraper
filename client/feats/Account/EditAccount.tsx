import React from 'react'
import { useForm } from 'react-hook-form'

import { FormInput, FormSubmit } from '@/comps/Form'
import { useEditMeMutation, useGetMeQuery } from '@/reducers'

import skele from '@/skeleton.css'

export const EditAccount = () => {
  const { data: dataMe } = useGetMeQuery()

  const [triggerEditMe] = useEditMeMutation()

  const { formState, handleSubmit, register, watch, reset } = useForm({ mode: `onChange` })

  const onSubmit = handleSubmit(async ({ newEmail, newUserName, newPassword, password }) => {
    await triggerEditMe({ userId: dataMe.id, newEmail, newUserName, newPassword, password })
    reset()
  })

  return (
    <form onSubmit={onSubmit} className={skele.column}>
      <div className={skele.row}>
        <FormInput
          identifier="newEmail"
          labelText="New email"
          register={register(`newEmail`, { maxLength: 255 })}
          errors={formState.errors}
        />
        <FormInput
          identifier="newUserName"
          labelText="New userName"
          register={register(`newUserName`, { maxLength: 32 })}
          errors={formState.errors}
        />
        <FormInput
          identifier="newPassword"
          labelText="New password"
          type="password"
          register={register(`newPassword`, { maxLength: 64 })}
          errors={formState.errors}
        />
        <FormInput
          identifier="newPasswordConfirm"
          labelText="Confirm new password"
          type="password"
          register={register(`newPasswordConfirm`, {
            validate: {
              matches: value => value === watch(`newPassword`) || `Passwords must match`,
            },
          })}
          errors={formState.errors}
        />
        <FormInput
          identifier="password"
          labelText="Authenticate with current password"
          type="password"
          register={register(`password`, { required: true })}
          errors={formState.errors}
        />
      </div>
      <FormSubmit formState={formState} value="Save" />
    </form>
  )
}
