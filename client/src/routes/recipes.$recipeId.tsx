import { createFileRoute } from "@tanstack/react-router"

import { Recipe } from "@/feats/Recipe"

export const Route = createFileRoute("/recipes/$recipeId")({
  component: Recipe,
})
