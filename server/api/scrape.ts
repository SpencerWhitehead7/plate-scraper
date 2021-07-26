import { Router } from "express";

import scrape from "../logic/scrape";

const scrapeRouter = Router();

// POST /api/scrape/
scrapeRouter.post("/", async (req, res, next) => {
  try {
    const recipeData = await scrape(req.body.url)
    res.json(recipeData);
  } catch (err) {
    next(err)
  }
});

export default scrapeRouter;
