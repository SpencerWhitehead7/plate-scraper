export type ApiUser = {
  id: number
  email: string
  userName: string
  createdAt: Date
  updatedAt: Date
  version: number
}

export type ApiRecipe = {
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

export type ApiTag = {
  name: string
  createdAt: Date
}

export type ApiUserWithRecipes = ApiUser & {
  recipes: ApiRecipe[]
}

export type CreateMeBody = {
  email: string
  userName: string
  password: string
}

export type UpdateMeBody = {
  password: string
} & (
  | { newEmail: string; newUserName?: string; newPassword?: string }
  | { newEmail?: string; newUserName: string; newPassword?: string }
  | { newEmail?: string; newUserName?: string; newPassword: string }
)

export type DeleteMeBody = {
  password: string
}

export type LoginBody = {
  email: string
  password: string
}

export type CreateRecipeBody = {
  text: string
  title: string
  sourceSite: string
  sourceUrl: string
  tags: string[]
}

export type UpdateRecipeBody = {
  text?: string
  title?: string
  tags?: string[]
}

export type ScrapeBody = {
  url: string
}
