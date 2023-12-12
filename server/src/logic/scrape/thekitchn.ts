import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const thekitchn = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, ".Recipe__title")
  const ingredients = getCleanStrings($, ".Recipe__ingredient")
  const instructions = getCleanStrings($, ".Recipe__instructionStep")

  return {
    sourceSite: "thekitchn.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
