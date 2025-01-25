import React from "react"
import { useForm } from "react-hook-form"

import { useMutationLogin } from "@/api"
import { CardTitle } from "@/comps/Card"
import { FormInput, FormSubmit } from "@/comps/Form"

import { useCtxModal } from "../modalContext"

type Props = {
  className?: string
}

export const LoginForm: React.FC<Props> = ({ className }) => {
  const { closeModal } = useCtxModal()

  const { mutate: triggerLogin } = useMutationLogin()

  const { formState, handleSubmit, register } = useForm({
    mode: "onChange",
    defaultValues: {
      loginEmail: "",
      loginPassword: "",
    },
  })

  const onSubmit = handleSubmit(({ loginEmail, loginPassword }) => {
    triggerLogin(
      { email: loginEmail, password: loginPassword },
      { onSuccess: closeModal },
    )
  })

  return (
    <form onSubmit={onSubmit} className={className}>
      <CardTitle>Login</CardTitle>
      <FormInput
        identifier="loginEmail"
        labelText="Email"
        register={register}
        registerOptions={{ required: true }}
        errors={formState.errors}
      />
      <FormInput
        identifier="loginPassword"
        labelText="Password"
        type="password"
        register={register}
        registerOptions={{ required: true }}
        errors={formState.errors}
      />
      <FormSubmit formState={formState} value="Login" />
    </form>
  )
}
