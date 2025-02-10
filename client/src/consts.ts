import { stringify as qsStringify } from "qs-esm"

export const SUPPORTED_SITES = [
  "allrecipes.com",
  "bonappetit.com",
  "budgetbytes.com",
  "cooking.nytimes.com",
  "delish.com",
  "eatingwell.com",
  "epicurious.com",
  "food.com",
  "food52.com",
  "foodandwine.com",
  "foodnetwork.com",
  "seriouseats.com",
  "simplyrecipes.com",
  "tasty.co",
  "thekitchn.com",
]

const SUPPORTED_SITES_FOR_DISPLAY_COLUMN_COUNT = 3
const SUPPORTED_SITES_FOR_DISPLAY_ROW_COUNT = Math.ceil(
  SUPPORTED_SITES.length / SUPPORTED_SITES_FOR_DISPLAY_COLUMN_COUNT,
)

export const SUPPORTED_SITES_FOR_DISPLAY = SUPPORTED_SITES.reduce<string[][]>(
  (rows, site, i) => {
    rows[i % rows.length].push(site)
    return rows
  },
  new Array(SUPPORTED_SITES_FOR_DISPLAY_ROW_COUNT)
    .fill(undefined)
    .map(() => []),
)

export const URL = {
  base: () => ({
    to: "/",
  }),
  usersAll: () => ({
    to: "/users",
  }),
  user: (userId: number) => ({
    to: "/users/$userId",
    params: { userId: String(userId) },
  }),
  recipesAll: (tags: string[] = []) => ({
    to: "/recipes",
    search: tags.length ? { tags } : {},
  }),
  recipe: (recipeId: number) => ({
    to: "/recipes/$recipeId",
    params: { recipeId: String(recipeId) },
  }),
} as const

export const PATH = {
  base: "/",
  usersAll: "/users/",
  user: "/users/$userId",
  recipesAll: "/recipes/",
  recipe: "/recipes/$recipeId",
} as const

export const API = {
  auth: () => "/api/auth",
  session: () => "/api/auth/session",
  recipe: (recipeId?: number) =>
    recipeId === undefined ? "/api/recipe" : `/api/recipe/${recipeId}`,
  recipesByTags: (tags?: string[]) =>
    tags === undefined ? "/api/recipe" : `/api/recipe?${qsStringify(tags)}`,
  recipeFork: (recipeId: number) => `/api/recipe/fork/${recipeId}`,
  scrape: () => "/api/scrape",
  user: (userId?: number) =>
    userId === undefined ? "/api/user" : `/api/user/${userId}`,
}
