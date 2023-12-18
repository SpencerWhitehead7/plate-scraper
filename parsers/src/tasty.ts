import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const tasty: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li[class*=ingredient]")
  const instructions = getCleanStrings($, "li", "ol[class*=prep-steps]").slice(
    0,
    -2,
  ) // the last two steps are always "Enjoy!" and some bullshit about downloading their app

  return {
    sourceSite: "tasty.co",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
