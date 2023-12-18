import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const myrecipes: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingredients-item")
  const instructions = getCleanStrings(
    $,
    "div[class=paragraph]", // SCREAM omg lol
    ".recipe-instructions",
  )

  return {
    sourceSite: "myrecipes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
