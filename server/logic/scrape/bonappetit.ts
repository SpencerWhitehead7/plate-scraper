import { getCleanStrings, getRecipe } from "./helpers"

const bonappetit = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingredients__text")
  const instructions = getCleanStrings($, ".step")

  return {
    sourceSite: "bonappetit.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

export default bonappetit
