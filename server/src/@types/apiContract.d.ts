/* eslint-disable @typescript-eslint/no-invalid-void-type */
type ApiTag = {
  name: string
  createdAt: Date
}

type ApiUser = {
  id: number
  email: string
  userName: string
  createdAt: Date
  updatedAt: Date
  version: number
}

type ApiRecipe = {
  id: number
  text: string
  title: string
  sourceSite: string
  sourceUrl: string
  createdBy: number
  forkedCount: number
  createdAt: Date
  updatedAt: Date
  version: number
  userId: number
  tags: ApiTag[]
}

type ApiUserWithRecipes = ApiUser & {
  recipes: ApiRecipe[]
}

// AUTH START
export type GetMeReq = void
export type GetMeRes = ApiUser | null

export type SignUpReq = {
  email: string
  userName: string
  password: string
}
export type SignUpRes = ApiUser | null

export type EditMeReq = {
  password: string
  newEmail?: string
  newUserName?: string
  newPassword?: string
}
export type EditMeRes = ApiUser | null

export type DeleteMeReq = {
  password: string
}
export type DeleteMeRes = void

export type LoginReq = {
  email: string
  password: string
}
export type LoginRes = ApiUser | null

export type LogoutReq = void
export type LogoutRes = void
// AUTH END

// RECIPE START
export type CreateRecipeReq = {
  text: string
  title: string
  sourceSite: string
  sourceUrl: string
  tags: string[]
}
export type CreateRecipeRes = ApiRecipe

export type GetRecipeReq = {
  recipeId: number
}
export type GetRecipeRes = ApiRecipe

export type GetRecipesByTagReq = {
  tags: string[]
}
export type GetRecipesByTagRes = ApiRecipe[]

// export type GetRecipesAllReq = void
// export type GetRecipesAllRes = ApiRecipe[]

export type ForkRecipeReq = {
  recipeId: number
}
export type ForkRecipeRes = ApiRecipe

export type EditRecipeReq = {
  recipeId: number
  text?: string
  title?: string
  tags?: string[]
}
export type EditRecipeRes = ApiRecipe

export type DeleteRecipeReq = {
  recipeId: number
}
export type DeleteRecipeRes = void
// RECIPE END

// SCRAPE START
export type ScrapeReq = {
  url: string
}
export type ScrapeRes = ApiRecipe | null
// SCRAPE END

// USER START
export type GetUsersAllReq = void
export type GetUsersAllRes = ApiUser[]

export type GetUserReq = {
  userId: string
}
export type GetUserRes = ApiUserWithRecipes | null
// USER END
