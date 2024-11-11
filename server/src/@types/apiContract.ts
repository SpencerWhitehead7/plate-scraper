import { z } from "zod"

// INTERNAL

const idParam = z.coerce.number().int().positive()

const alphanumeric = /^[a-z0-9]+$/i

const emailSchema = z.string().trim().toLowerCase().email()
// TODO: DEPLOY: minlength
const passwordSchema = z.string().trim().min(1).max(64)
const userNameSchema = z.string().trim().regex(alphanumeric).min(1).max(32)

const userData = z.object({
  email: emailSchema,
  userName: userNameSchema,
  password: passwordSchema,
})

export const authPostSchema = {
  body: userData,
}

export const authPutSchema = {
  body: z.object({
    password: passwordSchema,
    updatedUserData: z.union([
      userData.partial().required({ email: true }),
      userData.partial().required({ userName: true }),
      userData.partial().required({ password: true }),
    ]),
  }),
}

export const authDeleteSchema = {
  body: z.object({
    password: passwordSchema,
  }),
}

export const authSessionPostSchema = {
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
}

const textSchema = z.string().trim().min(1)
const titleSchema = z.string().trim().min(1)
const tagSchema = z
  .string()
  .trim()
  .toLowerCase()
  .transform((t) => t.replace(/[^a-z]/g, ""))
  .pipe(z.string().min(1).max(32))

export const recipeGetSchema = {
  query: z.record(z.string(), tagSchema),
}

export const recipePostSchema = {
  body: z.object({
    text: textSchema,
    title: titleSchema,
    sourceSite: z.string().trim().min(1).max(64).optional(),
    sourceUrl: z.string().trim().min(1).optional(),
    tags: tagSchema.array(),
  }),
}

export const recipeForkPostSchema = {
  params: z.object({
    id: idParam,
  }),
}

export const recipeIdGetSchema = {
  params: z.object({
    id: idParam,
  }),
}

export const recipeIdPutSchema = {
  params: z.object({
    id: idParam,
  }),
  body: z.object({
    text: textSchema.optional(),
    title: titleSchema.optional(),
    tags: tagSchema.array().optional(),
  }),
}

export const recipeIdDeleteSchema = {
  params: z.object({
    id: idParam,
  }),
}

export const scrapePostSchema = {
  body: z.object({
    url: z.string().trim().url(),
  }),
}

export const userIdGetSchema = {
  params: z.object({
    id: idParam,
  }),
}

// INPUT

export type CreateMeBody = z.infer<typeof authPostSchema.body>

export type UpdateMeBody = z.infer<typeof authPutSchema.body>

export type DeleteMeBody = z.infer<typeof authDeleteSchema.body>

export type LoginBody = z.infer<typeof authSessionPostSchema.body>

export type CreateRecipeBody = z.infer<typeof recipePostSchema.body>

export type UpdateRecipeBody = z.infer<typeof recipeIdPutSchema.body>

export type ScrapeBody = z.infer<typeof scrapePostSchema.body>

// OUTPUT

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
