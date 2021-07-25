import { Router } from "express";

import scrape from "../logic/scrape";

const scrapeRouter = Router();

// POST /api/scrape/
scrapeRouter.post("/", async (req, res, next) => {
  try {
    const recipeData = await scrape(req.body.url);
    // doesn't cover the parser just being wrong
    // but a missing title or recipe is a sure sign something is broken
    if (!recipeData.title || !recipeData.text) {
      throw new Error("Scrape failed: recipe parser out of service");
    } else {
      res.json(recipeData);
    }
  } catch (err) {
    res.status(400);
    next(err);
  }
});

export default scrapeRouter;
