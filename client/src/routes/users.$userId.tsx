import { createFileRoute } from "@tanstack/react-router"
import { useParams } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import {
  useMutationDeleteMe,
  useMutationLogout,
  useMutationUpdateMe,
  useQueryMe,
  useQueryUser,
} from "@/api"
import { ButtonSection } from "@/comps/Buttons"
import { Card, CardSubtitle, CardTitle } from "@/comps/Card"
import { FormInput } from "@/comps/Form"
import { FormInputButtonBar, FormSubmit } from "@/comps/Form"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { PageFailure } from "@/comps/PageFailure"
import { RecipeRows } from "@/comps/RecipeRows"
import { PATH } from "@/consts"
import { URL } from "@/consts"
import skele from "@/skeleton.module.css"

export const User: React.FC = () => {
  const { userId } = useParams({ from: PATH.user })
  const {
    isPending: isPendingUser,
    isSuccess: isSucccessUser,
    data: dataUser,
  } = useQueryUser(Number(userId))
  const { data: dataMe } = useQueryMe()

  const userIsMe = dataUser && dataMe && dataUser.id === dataMe.id

  const { mutate: triggerLogout } = useMutationLogout()

  const [section, setSection] = useState("")

  return isPendingUser ? (
    <LoadingIndicator />
  ) : isSucccessUser ? (
    <>
      <Card>
        <CardTitle>{dataUser.userName}</CardTitle>
        <CardSubtitle>Recipes</CardSubtitle>
        <RecipeRows recipes={dataUser.recipes} />
      </Card>

      {userIsMe && (
        <Card>
          <CardTitle>Settings</CardTitle>
          <ButtonSection>
            <button
              type="button"
              onClick={() => {
                setSection(section === "edit" ? "" : "edit")
              }}
            >
              Edit Account
            </button>
            <button
              type="button"
              onClick={() => {
                setSection(section === "destroy" ? "" : "destroy")
              }}
            >
              Destroy Account
            </button>
            <button
              type="button"
              onClick={() => {
                triggerLogout()
              }}
            >
              Log out
            </button>
          </ButtonSection>
          {section === "edit" && <Edit />}
          {section === "destroy" && <Delete />}
        </Card>
      )}
    </>
  ) : (
    <PageFailure type="no user" />
  )
}

export const Edit: React.FC = () => {
  const { mutate: triggerUpdateMe } = useMutationUpdateMe()

  const { formState, handleSubmit, register, watch, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      newEmail: "",
      newUserName: "",
      newPassword: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(
    ({ newEmail, newUserName, newPassword, password }) => {
      triggerUpdateMe(
        {
          password,
          updatedUserData: {
            email: newEmail,
            userName: newUserName,
            password: newPassword,
          },
        },
        {
          onSuccess: () => {
            reset()
          },
        },
      )
    },
  )

  return (
    <form onSubmit={onSubmit} className={skele.column}>
      <div className={skele.row}>
        <FormInput
          identifier="newEmail"
          labelText="New email"
          register={register}
          registerOptions={{ maxLength: 255 }}
          errors={formState.errors}
        />
        <FormInput
          identifier="newUserName"
          labelText="New userName"
          register={register}
          registerOptions={{ maxLength: 32 }}
          errors={formState.errors}
        />
        <FormInput
          identifier="newPassword"
          labelText="New password"
          type="password"
          register={register}
          registerOptions={{ maxLength: 64 }}
          errors={formState.errors}
        />
        <FormInput
          identifier="newPasswordConfirm"
          labelText="Confirm new password"
          type="password"
          register={register}
          registerOptions={{
            validate: {
              matches: (val) =>
                val === watch("newPassword") || "Passwords must match",
            },
          }}
          errors={formState.errors}
        />
        <FormInput
          identifier="password"
          labelText="Authenticate with current password"
          type="password"
          register={register}
          registerOptions={{ required: true }}
          errors={formState.errors}
        />
      </div>
      <FormSubmit formState={formState} value="Save" />
    </form>
  )
}

export const Delete: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: triggerDeleteMe } = useMutationDeleteMe()

  const { formState, handleSubmit, register } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = handleSubmit(({ password }) => {
    triggerDeleteMe(
      { password },
      { onSuccess: () => void navigate(URL.base()) },
    )
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

export const Route = createFileRoute("/users/$userId")({
  component: User,
})
