/* eslint-disable @typescript-eslint/no-invalid-void-type */
type ApiTag = {
  name: string
  createdAt: Date
}

type ApiMe = {
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

type ApiUser = ApiMe & {
  recipes: ApiRecipe[]
}

// gonna have to hand validate ALL the ress :(

// AUTH START
export type GetMeReq = void
export type GetMeRes = ApiMe | null

export type SignUpReq = {
  email: string
  userName: string
  password: string
}
export type SignUpRes = ApiMe | null

export type EditMeReq = {
  password: string
  newEmail?: string
  newUserName?: string
  newPassword?: string
}
export type EditMeRes = ApiMe | null

export type DeleteMeReq = {
  password: string
}
export type DeleteMeRes = void

export type LoginReq = {
  email: string
  password: string
}
export type LoginRes = ApiMe | null

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

export type GetRecipeByTagReq = {
  tags: string[]
}
export type GetRecipeByTagRes = ApiRecipe[]

// export type GetRecipeAllReq = void
// export type GetRecipeAllRes = ApiRecipe[]

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

export type ScrapeReq = {
  url: string
}
export type ScrapeRes = ApiRecipe | null

export type GetUserReq = {
  userId: string
}
export type GetUserRes = ApiUser | null
