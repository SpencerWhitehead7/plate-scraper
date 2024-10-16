import { createFileRoute } from "@tanstack/react-router"

import { RecipesAll } from "@/feats/RecipesAll"

type SearchParams = {
  tags?: string[]
}

export const Route = createFileRoute("/recipes/")({
  component: RecipesAll,
  validateSearch: ({ tags }): SearchParams => ({
    tags: Array.isArray(tags) ? tags : undefined,
  }),
})
