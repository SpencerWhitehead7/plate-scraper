import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { URL } from '@/consts'
import { FormInputButtonBar, FormSubmit } from '@/comps/Form'
import { useDeleteMeMutation, useGetMeQuery } from '@/reducers'

export const DeleteAccount = () => {
  const navigate = useNavigate()
  const { data: dataMe } = useGetMeQuery()
  const [triggerDeleteMe] = useDeleteMeMutation()

  const { formState, handleSubmit, register } = useForm({ mode: `onChange` })

  const onSubmit = handleSubmit(async ({ password }) => {
    await triggerDeleteMe({ userId: dataMe.id, password })
    navigate(URL.base)
  })

  return (
    <form onSubmit={onSubmit}>
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