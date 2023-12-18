import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const delish: Parser = ($, url) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", "ul[class*=ingredient-lists]")
  const instructions = $("li", "ol[class*=et3p2gv0]")
    .map((_, e) => {
      return $(e)
        .contents()
        .filter((_, e) => e.type === "text")
        .text()
        .trim()
        .replace(/\s+/g, " ")
    })
    .get() as string[]

  return {
    sourceSite: "delish.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
