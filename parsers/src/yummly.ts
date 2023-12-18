import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const yummly: Parser = ($, url) => {
  const title = getCleanStrings($, "h1[class*=recipe-title]")
  const ingredients = getCleanStrings($, "li.IngredientLine")
  const instructions = getCleanStrings($, "span.step")

  return {
    sourceSite: "yummly.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
