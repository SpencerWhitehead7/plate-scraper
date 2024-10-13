import qs from "qs"

export const SUPPORTED_SITES = [
  "allrecipes.com",
  "bettycrocker.com",
  "bonappetit.com",
  "budgetbytes.com",
  "delish.com",
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
  "tasty.co",
  "thekitchn.com",
  "yummly.com",
]

export const URL = {
  base: "/",
  scrape: "/scrape",
  upload: "/upload",
  usersAll: "/users",
  user: (userId: number) => `/users/${userId}`,
  recipesAll: (tags = [] as string[]) =>
    tags.length
      ? `/recipes${qs.stringify(tags, { addQueryPrefix: true })}`
      : "/recipes",
  recipe: (recipeId: number) => `/recipes/${recipeId}`,
}

export const PATH = {
  base: "/",
  scrape: "/scrape",
  upload: "/upload",
  usersAll: "/users",
  user: "/users/:userId",
  recipesAll: "/recipes",
  recipe: "/recipes/:recipeId",
}
