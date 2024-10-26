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
  base: () =>
    ({
      to: "/",
    }) as const,
  usersAll: () =>
    ({
      to: "/users",
    }) as const,
  user: (userId: number) =>
    ({
      to: "/users/$userId",
      params: { userId: String(userId) },
    }) as const,
  recipesAll: (tags: string[] = []) => ({
    to: "/recipes" as const,
    search: tags.length ? { tags } : {},
  }),
  recipe: (recipeId: number) =>
    ({
      to: "/recipes/$recipeId",
      params: { recipeId: String(recipeId) },
    }) as const,
} as const

export const PATH = {
  base: "/" as const,
  usersAll: "/users/" as const,
  user: "/users/$userId" as const,
  recipesAll: "/recipes/" as const,
  recipe: "/recipes/$recipeId" as const,
} as const
