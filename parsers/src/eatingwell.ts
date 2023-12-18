import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const eatingwell: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings(
    $,
    ".mntl-structured-ingredients__list-item",
  )
  const instructions = getCleanStrings(
    $,
    ".comp .mntl-sc-block .mntl-sc-block-html",
  )

  return {
    sourceSite: "eatingwell.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
