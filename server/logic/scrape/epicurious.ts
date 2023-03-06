import { RecipeData, getCleanStrings, getRecipe } from "./helpers"

export const epicurious = ($: cheerio.Root, url: string): RecipeData => {
  const title = getCleanStrings($, "h1")
  const ingredients = getCleanStrings($, "*", "div[class*=List-WECnc]")
  const instructions = getCleanStrings(
    $,
    "p",
    "div[data-testid=InstructionsWrapper]"
  )

  return {
    sourceSite: "epicurious.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
