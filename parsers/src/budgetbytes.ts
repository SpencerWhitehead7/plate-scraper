import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const budgetbytes: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings(
    $,
    "li",
    "ul[class*=wprm-recipe-ingredients]",
  )
  const instructions = getCleanStrings(
    $,
    "li",
    "ul[class*=wprm-recipe-instructions]",
  )

  return {
    sourceSite: "budgetbytes.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}