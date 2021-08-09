import { Router, RequestHandler } from "express";

import { isAuthenticated } from "../logic/auth";
import { serializers, permDeniedErr, notFoundRecipeErr } from "../logic/errors";
import { Tag } from "../db/entities";
import { recipeRepository, tagRepository } from "../db/repositories";

const recipeRouter = Router();

const recipeExists: RequestHandler = async (req, __, next) => {
  try {
    const recipe = await recipeRepository.getById(Number(req.params.id));
    if (!recipe) throw notFoundRecipeErr;

    (req as any).recipe = recipe;
    next();
  } catch (err) {
    next(err);
  }
}

const userOwnsRecipe: RequestHandler = (req, __, next) => {
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
    const { text, title, sourceSite, sourceUrl, tags } = req.body;
    const recipe = await recipeRepository.insert({
      text,
      title,
      sourceSite,
      sourceUrl,
      createdBy: req.user!.id,
      forkedCount: 0,
      userId: req.user!.id,
      tags: await tagRepository.getOrInsert(tags)
    });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipe/fork/:id
recipeRouter.post(`/fork/:id`, ...serializers.recipe.fork.id.post, ...canForkRecipe, async (req, res, next) => {
  try {
    const { user, recipe: originalRecipe } = req as any;

    // TODO: this should be a sql transaction
    const recipe = await recipeRepository.insert({
      ...originalRecipe,
      userId: user.id,
      forkedCount: 0,
    });
    if (originalRecipe.userId !== user.id) {
      await recipeRepository.update(originalRecipe.id, {
        forkedCount: originalRecipe.forkedCount + 1,
      });
    }
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
    const { text, title, tags } = req.body;
    const updatedRecipeData: { text?: string; title?: string; tags?: Tag[] } = {};
    if (text) updatedRecipeData.text = text;
    if (title) updatedRecipeData.title = title;
    if (tags) updatedRecipeData.tags = await tagRepository.getOrInsert(tags);

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

export default recipeRouter;
