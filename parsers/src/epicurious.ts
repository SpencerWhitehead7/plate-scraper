import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const epicurious: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "*", "div[class*=List-iSNGTT]")
  const instructions = getCleanStrings(
    $,
    "p",
    "div[data-testid=InstructionsWrapper]",
  )

  return {
    sourceSite: "epicurious.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
