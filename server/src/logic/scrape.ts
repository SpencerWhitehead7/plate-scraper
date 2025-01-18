import { load } from "cheerio"
import { selectParser } from "plate-scraper-parsers"

import { scrapeFailedErr, siteInvalidErr } from "./errors"

export const scrape = async (url: string) => {
  const parser = selectParser(url)
  if (parser === null) throw siteInvalidErr

  const res = await fetch(url)
  const html = await res.text()
  const $ = load(html)

  const recipe = parser($, url)

  // this doesn't cover all _nearly_ the ways the parser can be wrong
  // but no title, no ingredients, or no instructions is a sure sign _something's_ broken
  const compressedText = recipe.text.replace(/\s/g, "")
  const hasNoTitle = !recipe.title
  const hasNoIngredients = compressedText.includes("IngredientsInstructions")
  const hasNoInstructions = compressedText.endsWith("Instructions")
  if (hasNoTitle || hasNoIngredients || hasNoInstructions) throw scrapeFailedErr

  return recipe
}
