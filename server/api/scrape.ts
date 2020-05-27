import { Router } from "express";
const scrape = require(`../logic`);

const scrapeRouter = Router();

// POST /api/scrape/
scrapeRouter.post(`/`, async (req, res, next) => {
  try {
    const recipeData = await scrape(req.body.url);
    // doesn't cover all failure states or the parser just being wrong
    // but no data or a missing title/recipe is a sure sign something went wrong
    if (!recipeData || !recipeData.title || !recipeData.recipe) {
      res.status(400);
      throw new Error(`Scrape failed`);
    } else {
      res.json(recipeData);
    }
  } catch (err) {
    next(err);
  }
});

export default scrapeRouter;
