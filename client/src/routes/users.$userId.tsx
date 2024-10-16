import { createFileRoute } from "@tanstack/react-router"

import { User } from "@/feats/User"

export const Route = createFileRoute("/users/$userId")({
  component: User,
})
