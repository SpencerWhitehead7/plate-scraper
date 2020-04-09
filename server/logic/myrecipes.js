const { getCleanStrings, getRecipe } = require(`./helpers`)

const myrecipes = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingredients li`)
  const instructions = getCleanStrings($, `.step p`)

  return {
    sourceSite: `myrecipes.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = myrecipes
