import { RecipeData, getCleanStrings, getRecipe } from "./helpers"

export const jamieoliver = ($: cheerio.Root, url: string): RecipeData => {
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
