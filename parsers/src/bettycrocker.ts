import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const bettycrocker: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingredient")
  const instructions = getCleanStrings($, ".stepDescription")

  return {
    sourceSite: "bettycrocker.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
