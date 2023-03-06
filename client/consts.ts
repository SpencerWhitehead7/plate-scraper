import qs from "qs"

export const SUPPORTED_SITES = [
  "allrecipes.com",
  "bettycrocker.com",
  "bonappetit.com",
  "cookinglight.com",
  "eatingwell.com",
  "epicurious.com",
  "food.com",
  "food52.com",
  "foodandwine.com",
  "foodnetwork.com",
  "jamieoliver.com",
  "myrecipes.com",
  "seriouseats.com/recipes",
  "simplyrecipes.com",
  "thekitchn.com",
]

export const URL = {
  base: "/",
  scrape: "/scrape",
  upload: "/upload",
  user: (userId: number) => `/user/${userId}`,
  recipe: (recipeId: number) => `/recipe/${recipeId}`,
  search: (tags = [] as string[]) =>
    tags.length
      ? `/search${qs.stringify(tags, { addQueryPrefix: true })}`
      : "/search",
}

export const PATH = {
  base: "/",
  scrape: "/scrape",
  upload: "/upload",
  user: "/user/:userId",
  recipe: "/recipe/:recipeId",
  search: "/search",
}
