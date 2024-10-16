import { createFileRoute } from "@tanstack/react-router"

import { UsersAll } from "@/feats/UsersAll"

export const Route = createFileRoute("/users/")({
  component: UsersAll,
})
