import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const delish = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", "ul[class*=ingredient-lists]")
  const instructions = $("li", "ol[class*=et3p2gv0]")
    .map(function (this: cheerio.Element) {
      return $(this)
        .contents()
        .filter(function (this: cheerio.Element) {
          return this.type === "text"
        })
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
