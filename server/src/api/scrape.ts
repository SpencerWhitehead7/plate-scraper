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

    const { data, isValid } = parser($, url)

    if (!isValid) throw scrapeFailedErr

    res.json(data)
  } catch (err) {
    next(err)
  }
})
