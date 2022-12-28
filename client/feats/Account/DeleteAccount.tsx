import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { FormInputButtonBar, FormSubmit } from "@/comps/Form"
import { URL } from "@/consts"
import { useDeleteMeMutation, useGetMeQuery } from "@/reducers"

export const DeleteAccount = () => {
  const navigate = useNavigate()
  const { data: dataMe } = useGetMeQuery()
  const [triggerDeleteMe] = useDeleteMeMutation()

  const { formState, handleSubmit, register } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = handleSubmit(async ({ password }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await triggerDeleteMe({ userId: dataMe!.id, password })
    navigate(URL.base)
  })

  return (
    <form onSubmit={onSubmit}>
      <FormInputButtonBar
        identifier="password"
        labelText="Confirm with password"
        type="password"
        register={register}
        registerOptions={{ required: true }}
        errors={formState.errors}
        Button={
          <FormSubmit
            formState={formState}
            value="Destroy (Are you sure? This cannot be undone!)"
          />
        }
      />
    </form>
  )
}
