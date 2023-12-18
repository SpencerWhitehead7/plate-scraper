import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const food52: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", ".recipe__list--ingredients")
  const instructions = getCleanStrings($, "li", ".recipe__list--steps")

  return {
    sourceSite: "food52.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
