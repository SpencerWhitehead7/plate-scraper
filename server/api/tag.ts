import { Router, Request, Response, NextFunction } from "express";

import { isAuthenticated } from "../logic/auth";
import { recipeRepository, tagRepository } from "../db/repositories";

const tagRouter = Router();

// TODO: handle does tag exist (via middleware?)
const doesRecipeExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipeId = req.params.recipeId
      ? req.params.recipeId
      : req.body.recipeId;
    const recipe = await recipeRepository.getById(recipeId);
    if (recipe) {
      req.body.recipe = recipe;
      next();
    } else {
      res.status(404);
      throw new Error(`Recipe not found`);
    }
  } catch (err) {
    next(err);
  }
};

const isOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.recipe.userId === (req.user as any).id) {
    next();
  } else {
    res.status(401);
    next(new Error(`Permission denied`));
  }
};

// POST /api/tag
tagRouter.post(
  `/`,
  isAuthenticated,
  doesRecipeExist,
  isOwner,
  async (req, res, next) => {
    try {
      const name = req.body.name.toLowerCase().replace(/[^a-z]/gi, ``);
      await tagRepository.insert(name, [req.body.recipe]);
      const updatedRecipe = await recipeRepository.getById(req.body.recipeId);
      res.json(updatedRecipe);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/tag/:recipeId/:tagId
tagRouter.delete(
  `/:recipeId/:tagName`,
  isAuthenticated,
  doesRecipeExist,
  isOwner,
  async (req, res, next) => {
    try {
      await tagRepository.remove(req.params.tagName, [req.body.recipe]);
      const updatedRecipe = await recipeRepository.getById(
        Number(req.params.recipeId)
      );
      res.json(updatedRecipe);
    } catch (err) {
      next(err);
    }
  }
);

export default tagRouter;
