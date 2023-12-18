import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const foodnetwork: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "p[class=o-Ingredients__a-Ingredient]")
  const instructions = getCleanStrings($, "li[class=o-Method__m-Step]")

  return {
    sourceSite: "foodnetwork.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
