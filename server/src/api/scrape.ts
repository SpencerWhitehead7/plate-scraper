import { load } from "cheerio"
import { Router } from "express"
import { selectParser } from "plate-scraper-parsers"

import { scrapePostSchema } from "../@types/apiContract"
import { scrapeFailedErr, scrapeSiteInvalidErr } from "../logic/errors"
import { validate } from "../logic/serialization"

export const scrapeRouter = Router()

// POST /api/scrape/
scrapeRouter.post("/", validate(scrapePostSchema), async (req, res, next) => {
  try {
    const { url } = req.body

    const parser = selectParser(url)
    if (parser === null) throw scrapeSiteInvalidErr

    const recipeRes = await fetch(url)
    const recipeHtml = await recipeRes.text()
    const $ = load(recipeHtml)

    const recipe = parser($, url)

    // this doesn't cover all _nearly_ the ways the parser can be wrong
    // but no title, no ingredients, or no instructions is a sure sign _something's_ broken
    const compressedText = recipe.text.replace(/\s/g, "")
    const hasNoTitle = !recipe.title
    const hasNoIngredients = compressedText.includes("IngredientsInstructions")
    const hasNoInstructions = compressedText.endsWith("Instructions")
    if (hasNoTitle || hasNoIngredients || hasNoInstructions)
      throw scrapeFailedErr

    res.json(recipe)
  } catch (err) {
    next(err)
  }
})
