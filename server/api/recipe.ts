import { Router, Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../logic/auth";
import { recipeRepository, tagRepository } from "../db/repositories";

const recipeRouter = Router();

// TODO: add middleware to validate that recipe exists for deletes, edits, etc
// or maybe it should be part of serializer
const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, user } = req;
    const recipe = await recipeRepository.getById(Number(params.id));
    if (recipe!.userId !== (user as any).id) {
      res.status(401);
      throw new Error(`Permission denied`);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/recipe
recipeRouter.get(`/`, async (_, res, next) => {
  try {
    const recipes = await recipeRepository.getAll();
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

// POST /api/recipe
recipeRouter.post(`/`, isAuthenticated, async (req, res, next) => {
  try {
    const { text, title, sourceSite, sourceUrl, tags } = req.body;
    const recipe = await recipeRepository.insert({
      text,
      title,
      sourceSite,
      sourceUrl,
      createdBy: (req.user as any).id,
      forkedCount: 0,
      user: req.user as any,
      tags: await tagRepository.getOrInsert(
        // TODO serializers
        tags.map((tag: string) => tag.toLowerCase().replace(/[^a-z]/gi, ``))
      ),
    });
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

// GET /api/recipe/byid/:id
recipeRouter.get(`/byid/:id`, async (req, res, next) => {
  try {
    const recipe = await recipeRepository.getById(Number(req.params.id));
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

// GET /api/recipe/bytag
recipeRouter.get(`/bytag`, async (req, res, next) => {
  try {
    const recipes = await recipeRepository.getByTagNames(
      Object.values(req.query).map((tagName) =>
        (tagName as string).toLowerCase().replace(/[^a-z]/gi, ``)
      )
    );
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

// POST /api/recipe/fork/:id
recipeRouter.post(`/fork/:id`, isAuthenticated, async (req, res, next) => {
  try {
    const { params, user } = req;
    const originalRecipe = await recipeRepository.getById(Number(params.id));
    if (originalRecipe) {
      const recipe = await recipeRepository.insert({
        ...originalRecipe,
        user: user as any,
        forkedCount: 0,
      });
      if (originalRecipe.userId !== (user as any).id) {
        await recipeRepository.update(originalRecipe.id, {
          forkedCount: originalRecipe.forkedCount + 1,
        });
      }
      res.json(recipe);
    } else {
      res.status(404);
      throw new Error(`Recipe not found`);
    }
  } catch (error) {
    next(error);
  }
});

// PUT /api/recipe/:id
recipeRouter.put(`/:id`, isAuthenticated, isOwner, async (req, res, next) => {
  try {
    const { text, title, tags } = req.body;
    const recipe = await recipeRepository.update(Number(req.params.id), {
      text,
      title,
      tags: await tagRepository.getOrInsert(
        // TODO serializers
        tags.map((tag: string) => tag.toLowerCase().replace(/[^a-z]/gi, ``))
      ),
    });
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/recipe/:id
recipeRouter.delete(
  `/:id`,
  isAuthenticated,
  isOwner,
  async (req, res, next) => {
    try {
      await recipeRepository.delete(Number(req.params.id));
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

export default recipeRouter;
