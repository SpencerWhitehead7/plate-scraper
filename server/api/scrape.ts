import { Router } from "express";

import { serializers } from "../logic/errors"
import scrape from "../logic/scrape";

const scrapeRouter = Router();

// POST /api/scrape/
scrapeRouter.post("/", ...serializers.scrape.post, async (req, res, next) => {
  try {
    const { url } = req.body
    const recipeData = await scrape(url)
    res.json(recipeData);
  } catch (err) {
    next(err)
  }
});

export default scrapeRouter;
