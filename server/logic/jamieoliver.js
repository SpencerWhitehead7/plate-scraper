const { getCleanStrings, getRecipe } = require(`./helpers`)

const jamieoliver = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingred-list li`)
  const instructions = getCleanStrings($, `.recipeSteps li`)

  return {
    sourceSite: `jamieoliver.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = jamieoliver
