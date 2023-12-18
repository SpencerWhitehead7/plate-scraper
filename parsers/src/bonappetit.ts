import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const bonappetit: Parser = ($, url) => {
  // I cannot believe how awful their html is
  const title = getCleanStrings($, "h1")
  // this bullshit is because the ingredient quantities and names are in different tags
  // they can both be retrieved in one pass, but then they need to be knitted together
  const ingredients = $("*", ".List-iSNGTT")
    .map((_, e) => $(e).text().trim().replace(/\s+/g, " "))
    .get() // this chunk is just getCleanStrings without the filter for empty strings
    // some ingredients do not have a quantity (ie, asking for just pepper)
    // and filtering them out wrecks the even-number-quantity, odd-number-name indexing
    .reduce<string[]>((acc, curr, i, arr) => {
      if (i % 2 === 0) acc.push(`${curr} ${arr[i + 1]}`.trim())
      return acc
    }, [])
  const instructions = getCleanStrings(
    $,
    "p",
    "li[class^=InstructionListWrapper]",
  )

  return {
    sourceSite: "bonappetit.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
