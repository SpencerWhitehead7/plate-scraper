import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const jamieoliver: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingred-list li")
  const instructions = getCleanStrings($, ".recipeSteps li")

  return {
    sourceSite: "jamieoliver.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
