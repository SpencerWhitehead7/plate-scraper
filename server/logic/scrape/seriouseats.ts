import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const seriousEats = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".structured-ingredients__list-item")
  const instructions = getCleanStrings(
    $,
    "p",
    "ol[class*=mntl-sc-block-group--OL]"
  )

  return {
    sourceSite: "seriouseats.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
