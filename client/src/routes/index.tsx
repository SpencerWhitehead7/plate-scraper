import { createFileRoute } from "@tanstack/react-router"

import { Home } from "@/feats/Home"

export const Route = createFileRoute("/")({
  component: Home,
})
