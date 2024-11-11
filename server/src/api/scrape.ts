import { Router } from "express"

import { scrapePostSchema } from "../@types/apiContract"
import { scrape } from "../logic/scrape"
import { validate } from "../logic/serialization"

export const scrapeRouter = Router()

// POST /api/scrape/
scrapeRouter.post("/", validate(scrapePostSchema), async (req, res, next) => {
  try {
    const recipeUrl = req.body.url
    const recipeData = await scrape(recipeUrl)
    res.json(recipeData)
  } catch (err) {
    next(err)
  }
})
