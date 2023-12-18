import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const simplyrecipes: Parser = ($, url) => {
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
