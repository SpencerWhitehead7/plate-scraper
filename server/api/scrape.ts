import { Router } from "express";

import { ScrapeReq } from "../@types/apiContract";
import { serializers } from "../logic/errors"
import { scrape } from "../logic/scrape";

export const scrapeRouter = Router();

// POST /api/scrape/
scrapeRouter.post("/", ...serializers.scrape.post, async (req, res, next) => {
  try {
    const { url } = req.body as ScrapeReq
    const recipeData = await scrape(url)
    res.json(recipeData);
  } catch (err) {
    next(err)
  }
});
