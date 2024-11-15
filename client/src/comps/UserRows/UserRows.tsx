import { Link } from "@tanstack/react-router"
import React from "react"

import { ApiUser } from "@/@types/apiContract"
import { URL } from "@/consts"

import s from "./UserRows.module.scss"

const UserRow: React.FC<ApiUser> = ({ id, userName }) => (
  <div className={s.userRow}>
    <Link {...URL.user(id)}>{userName}</Link>
  </div>
)

type Props = {
  users: ApiUser[]
}

export const UserRows: React.FC<Props> = ({ users }) => (
  <>
    {users.map((user: ApiUser) => (
      <UserRow key={user.id} {...user} />
    ))}
  </>
)
