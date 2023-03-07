import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const yummly = ($: cheerio.Root, url: string): RecipeData => {
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
