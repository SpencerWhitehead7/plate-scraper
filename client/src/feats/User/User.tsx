import { useParams } from "@tanstack/react-router"
import React, { useState } from "react"

import { ButtonSection } from "@/comps/Buttons"
import { Card, CardSubtitle, CardTitle } from "@/comps/Card"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { RecipeRows } from "@/comps/RecipeRows"
import { PATH } from "@/consts"
import { PageFailure } from "@/feats/PageFailure"
import { useGetMeQuery, useGetUserQuery, useLogoutMutation } from "@/reducers"

import { Delete } from "./Delete"
import { Edit } from "./Edit"

export const User: React.FC = () => {
  const { userId } = useParams({ from: PATH.user })
  const { isLoading: isLoadingUser, data: dataUser } = useGetUserQuery({
    userId,
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
          {section === "edit" && <Edit />}
          {section === "destroy" && <Delete />}
        </Card>
      )}
    </>
  ) : (
    <PageFailure type="no user" />
  )
}
