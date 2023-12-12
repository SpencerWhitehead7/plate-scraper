import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const simplyrecipes = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".structured-ingredients__list-item")
  const instructions = getCleanStrings($, ".mntl-sc-block-group--LI > p")

  return {
    sourceSite: "simplyrecipes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
