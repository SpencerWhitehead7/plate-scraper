import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const foodandwine: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", "ul[class*=ingredients]")
  const instructions = getCleanStrings($, "li", "ol")

  return {
    sourceSite: "foodandwine.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
