import { RecipeData, getCleanStrings, getRecipe } from "./helpers"

export const foodandwine = ($: cheerio.Root, url: string): RecipeData => {
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
