import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const delish = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "li", "ul[class*=ingredient-lists]")
  const instructions = $("li", "ol[class*=et3p2gv0]")
    .map(function (this: void) {
      return $(this)
        .contents()
        .filter(function (this: void) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          return (this as any).type === "text"
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
