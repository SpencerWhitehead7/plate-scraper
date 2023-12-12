import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const food52 = ($: cheerio.Root, url: string): RecipeData => {
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
