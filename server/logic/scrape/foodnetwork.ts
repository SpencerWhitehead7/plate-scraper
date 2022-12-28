import { getCleanStrings, getRecipe } from "./helpers"

const foodnetwork = ($: cheerio.Root, url: string) => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, ".o-Ingredients__m-Body p")
  const instructions = getCleanStrings($, ".o-Method__m-Body ol li")

  return {
    sourceSite: "foodnetwork.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}

export default foodnetwork
