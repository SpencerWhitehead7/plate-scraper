import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const cookinglight = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingredients li")
  const instructions = getCleanStrings($, ".step p")

  return {
    sourceSite: "cookinglight.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
