import { createFileRoute } from "@tanstack/react-router"
import React from "react"

import { useQueryUsersAll } from "@/api"
import { Card, CardTitle } from "@/comps/Card"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { UserRows } from "@/comps/UserRows"

export const UsersAll: React.FC = () => {
  const {
    isPending: isPendingUsersAll,
    isSuccess: isSucccessUsersAll,
    data: dataUsersAll,
  } = useQueryUsersAll()

  return (
    <Card>
      <CardTitle>Users</CardTitle>
      {isPendingUsersAll ? (
        <LoadingIndicator />
      ) : isSucccessUsersAll ? (
        <UserRows users={dataUsersAll} />
      ) : null}
    </Card>
  )
}

export const Route = createFileRoute("/users/")({
  component: UsersAll,
})
