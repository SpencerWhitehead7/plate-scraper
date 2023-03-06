import { RecipeData, getCleanStrings, getRecipe } from "./helpers"

export const food = ($: cheerio.Root, url: string): RecipeData => {
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
