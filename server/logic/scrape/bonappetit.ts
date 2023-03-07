import { getCleanStrings, getRecipe, RecipeData } from "./helpers"

export const bonappetit = ($: cheerio.Root, url: string): RecipeData => {
  // I cannot believe how awful their html markup is
  const title = getCleanStrings($, "h1")
  // this bullshit is because the ingredient quantities and names are in different tags
  // they can both be retrieved in one pass, but then they need to be knitted together
  const ingredients = $("*", ".List-WECnc")
    .map(function (this: void) {
      return $(this).text().trim().replace(/\s+/g, " ")
    })
    .get() // this chunk is just getCleanStrings without the filter for empty strings
    // some ingredients do not have a quantity (ie, asking for just pepper)
    .reduce<string[]>((acc, curr: string, i, arr: string[]) => {
      if (i % 2 === 0) acc.push(`${curr} ${arr[i + 1]}`.trim())
      return acc
    }, [])
  const instructions = getCleanStrings(
    $,
    "p",
    "li[class^=InstructionListWrapper]"
  )

  return {
    sourceSite: "bonappetit.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
