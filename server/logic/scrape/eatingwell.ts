import { RecipeData, getCleanStrings, getRecipe } from "./helpers"

export const eatingwell = ($: cheerio.Root, url: string): RecipeData => {
  let title
  let ingredients
  let instructions

  // two known recipe page templates; one without a main with that class, one with
  if ($("body").hasClass("template-recipe")) {
    title = getCleanStrings($, ".headline-wrapper")
    ingredients = getCleanStrings($, ".ingredients-item")
    instructions = getCleanStrings($, ".section-body", ".instructions-section")
  } else {
    title = getCleanStrings($, ".hideOnTabletToDesktop")
    ingredients = getCleanStrings($, ".checkListListItem.checkListLine span")
    instructions = getCleanStrings($, ".recipeDirectionsListItem")
  }
  return {
    sourceSite: "eatingwell.com",
    sourceUrl: url,
    text: getRecipe(url, title, ingredients, instructions),
    title: title[0],
  }
}
