import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const myrecipes = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingredients-item")
  const instructions = getCleanStrings(
    $,
    "div[class=paragraph]", // SCREAM omg lol
    ".recipe-instructions"
  )

  return {
    sourceSite: "myrecipes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
