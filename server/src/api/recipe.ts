import { RequestHandler, Router } from "express"

import {
  recipeForkPostSchema,
  recipeGetSchema,
  recipeIdDeleteSchema,
  recipeIdGetSchema,
  recipeIdPutSchema,
  recipePostSchema,
} from "../@types/apiContract"
import { Recipe } from "../db/entities"
import { recipeRepository } from "../db/repositories"
import { isAuthenticated } from "../logic/auth"
import { notFoundRecipeErr, permDeniedErr } from "../logic/errors"
import { validate } from "../logic/serialization"

export const recipeRouter = Router()

const recipeExists: RequestHandler<{ id: number }> = async (req, __, next) => {
  try {
    const recipeId = req.params.id
    const recipe = await recipeRepository.getById(recipeId)
    if (!recipe) throw notFoundRecipeErr

    // @ts-expect-error put it at the same level as user
    req.recipe = recipe
    next()
  } catch (err) {
    next(err)
  }
}

const userOwnsRecipe: RequestHandler<{ id: number }> = (req, __, next) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = req.user!
  // @ts-expect-error recipe added by recipeExists
  const recipe = req.recipe as Recipe

  recipe.userId === user.id ? next() : next(permDeniedErr)
}

// GET /api/recipe
recipeRouter.get("/", validate(recipeGetSchema), async (req, res, next) => {
  try {
    const tags = Object.values(req.query)
    const recipes = await (tags.length
      ? recipeRepository.getByTagNames(tags)
      : recipeRepository.getAll())

    res.json(recipes)
  } catch (err) {
    next(err)
  }
})

// POST /api/recipe
recipeRouter.post(
  "/",
  isAuthenticated(),
  validate(recipePostSchema),
  async (req, res, next) => {
    try {
      const recipeData = req.body
      const recipe = await recipeRepository.insert({
        ...recipeData,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        createdBy: req.user!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req.user!.id,
      })
      res.json(recipe)
    } catch (err) {
      next(err)
    }
  },
)

// POST /api/recipe/fork/:id
recipeRouter.post(
  "/fork/:id",
  isAuthenticated(),
  validate(recipeForkPostSchema),
  recipeExists,
  async (req, res, next) => {
    try {
      // @ts-expect-error recipe added by recipeExists
      const originalRecipe = req.recipe as Recipe
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const user = req.user!

      const recipe = await recipeRepository.fork(originalRecipe, user.id)
      res.json(recipe)
    } catch (err) {
      next(err)
    }
  },
)

// GET /api/recipe/:id
recipeRouter.get(
  "/:id",
  validate(recipeIdGetSchema),
  async (req, res, next) => {
    try {
      const recipeId = req.params.id
      const recipe = await recipeRepository.getById(recipeId)
      if (!recipe) throw notFoundRecipeErr

      res.json(recipe)
    } catch (err) {
      next(err)
    }
  },
)

// PUT /api/recipe/:id
recipeRouter.put(
  "/:id",
  isAuthenticated(),
  validate(recipeIdPutSchema),
  recipeExists,
  userOwnsRecipe,
  async (req, res, next) => {
    try {
      const recipeId = req.params.id
      const updatedRecipeData = req.body
      const updatedRecipe = await recipeRepository.update(
        recipeId,
        updatedRecipeData,
      )
      res.json(updatedRecipe)
    } catch (err) {
      next(err)
    }
  },
)

// DELETE /api/recipe/:id
recipeRouter.delete(
  "/:id",
  isAuthenticated(),
  validate(recipeIdDeleteSchema),
  recipeExists,
  userOwnsRecipe,
  async (req, res, next) => {
    try {
      const recipeId = req.params.id
      await recipeRepository.delete(recipeId)
      res.end()
    } catch (err) {
      next(err)
    }
  },
)
