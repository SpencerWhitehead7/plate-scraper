import { RecipeData, getCleanStrings, getRecipe } from "./helpers"

export const tasty = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  // ask me not wby, but for some reason their page includes everything twice
  const dblIngredients = getCleanStrings($, "li[class*=ingredient]")
  const ingredients = dblIngredients.slice(0, dblIngredients.length / 2)
  const dblInstructions = getCleanStrings($, "li", "ol[class*=prep-steps]")
  const instructions = dblInstructions.slice(0, dblInstructions.length / 2)

  return {
    sourceSite: "tasty.co",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
