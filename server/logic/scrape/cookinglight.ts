import { getCleanStrings, getRecipe } from "./helpers"

const cookinglight = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".ingredients li")
  const instructions = getCleanStrings($, ".step p")

  return {
    sourceSite: "cookinglight.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

export default cookinglight
