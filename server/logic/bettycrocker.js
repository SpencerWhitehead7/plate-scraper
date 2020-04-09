const { getCleanStrings, getRecipe } = require(`./helpers`)

const bettycrocker = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.recipePartIngredient`)
  const instructions = getCleanStrings($, `.recipePartStepDescription`)

  return {
    sourceSite: `bettycrocker.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = bettycrocker
