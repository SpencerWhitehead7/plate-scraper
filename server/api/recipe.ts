import { Router, RequestHandler } from "express";

import { CreateRecipeReq, EditRecipeReq } from "../@types/apiContract";
import { isAuthenticated } from "../logic/auth";
import { serializers, permDeniedErr, notFoundRecipeErr } from "../logic/errors";
import { Recipe, User } from "../db/entities";
import { recipeRepository } from "../db/repositories";

export const recipeRouter = Router();

const recipeExists: RequestHandler = async (req, __, next) => {
  try {
    const recipe = await recipeRepository.getById(Number(req.params.id));
    if (!recipe) throw notFoundRecipeErr;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (req as any).recipe = recipe;
    next();
  } catch (err) {
    next(err);
  }
}

const userOwnsRecipe: RequestHandler = (req, __, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion
  (req as any).recipe.userId === req.user!.id ? next() : next(permDeniedErr);
}

const canAlterRecipe = [isAuthenticated, recipeExists, userOwnsRecipe]

const canForkRecipe = [isAuthenticated, recipeExists]

// GET /api/recipe
recipeRouter.get(`/`, ...serializers.recipe.get, async (req, res, next) => {
  try {
    const tags = Object.values(req.query) as string[];
    const recipes = await (
      tags.length
        ? recipeRepository.getByTagNames(tags)
        : recipeRepository.getAll()
    );

    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipe
recipeRouter.post(`/`, isAuthenticated, ...serializers.recipe.post, async (req, res, next) => {
  try {
    const { text, title, sourceSite, sourceUrl, tags } = req.body as CreateRecipeReq;
    const recipe = await recipeRepository.insert({
      text,
      title,
      sourceSite,
      sourceUrl,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createdBy: req.user!.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: req.user!.id,
      tags,
    });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipe/fork/:id
recipeRouter.post(`/fork/:id`, ...serializers.recipe.fork.id.post, ...canForkRecipe, async (req, res, next) => {
  try {
    const { user, recipe: originalRecipe } = req as unknown as { user: User, recipe: Recipe };

    const recipe = await recipeRepository.fork(originalRecipe, user.id);
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// GET /api/recipe/:id
recipeRouter.get(`/:id`, ...serializers.recipe.id.get, async (req, res, next) => {
  try {
    const recipe = await recipeRepository.getById(Number(req.params.id));
    if (!recipe) throw notFoundRecipeErr

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipe/:id
recipeRouter.put(`/:id`, ...serializers.recipe.id.put, ...canAlterRecipe, async (req, res, next) => {
  try {
    const { text, title, tags } = req.body as EditRecipeReq;
    const updatedRecipeData: { text?: string; title?: string; tags?: string[] } = {};
    if (text) updatedRecipeData.text = text;
    if (title) updatedRecipeData.title = title;
    if (tags) updatedRecipeData.tags = tags;

    const updatedRecipe = await recipeRepository.update(Number(req.params.id), updatedRecipeData);
    res.json(updatedRecipe);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipe/:id
recipeRouter.delete(`/:id`, ...serializers.recipe.id.delete, ...canAlterRecipe, async (req, res, next) => {
  try {
    await recipeRepository.delete(Number(req.params.id));
    res.end();
  } catch (err) {
    next(err);
  }
});
