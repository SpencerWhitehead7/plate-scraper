import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { ButtonSection } from "@/comps/Buttons"
import { Card, CardSubtitle, CardTitle } from "@/comps/Card"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { RecipeRows } from "@/comps/RecipeRows"
import { PageFailure } from "@/feats/PageFailure"
import { useGetMeQuery, useGetUserQuery, useLogoutMutation } from "@/reducers"

import { DeleteAccount } from "./DeleteAccount"
import { EditAccount } from "./EditAccount"

export const Account = () => {
  const { userId } = useParams()
  const { isLoading: isLoadingUser, data: dataUser } = useGetUserQuery({
    userId: userId ?? "",
  })
  const { data: dataMe } = useGetMeQuery()

  const userIsMe = dataUser && dataMe && dataUser.id === dataMe.id

  const [triggerLogout] = useLogoutMutation()

  const [section, setSection] = useState("")

  return isLoadingUser ? (
    <LoadingIndicator />
  ) : dataUser ? (
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
                void triggerLogout()
              }}
            >
              Log out
            </button>
          </ButtonSection>
          {section === "edit" && <EditAccount />}
          {section === "destroy" && <DeleteAccount />}
        </Card>
      )}
    </>
  ) : (
    <PageFailure type="No such user" />
  )
}
