import React from "react"

import { Card, CardTitle } from "@/comps/Card"
import { LoadingIndicator } from "@/comps/LoadingIndicator"
import { UserRows } from "@/comps/UserRows"
import { useGetUsersAllQuery } from "@/reducers/api"

export const UsersAll: React.FC = () => {
  const { isFetching: isFetchingUsersAll, data: dataUsersAll } =
    useGetUsersAllQuery()

  return (
    <Card>
      <CardTitle>Users</CardTitle>
      {isFetchingUsersAll ? (
        <LoadingIndicator />
      ) : (
        dataUsersAll && <UserRows users={dataUsersAll} />
      )}
    </Card>
  )
}
