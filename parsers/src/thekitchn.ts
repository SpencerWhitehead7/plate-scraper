import { getCleanStrings, getRecipe, Parser } from "./helpers"

export const thekitchn: Parser = ($, url) => {
  const title = getCleanStrings($, ".Recipe__title")
  const ingredients = getCleanStrings($, ".Recipe__ingredient")
  const instructions = getCleanStrings($, ".Recipe__instructionStep")

  return {
    sourceSite: "thekitchn.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
