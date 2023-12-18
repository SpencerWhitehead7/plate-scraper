import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const food: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", ".ingredient-list")
  const instructions = getCleanStrings($, "li", ".direction-list")

  return {
    sourceSite: "food.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
