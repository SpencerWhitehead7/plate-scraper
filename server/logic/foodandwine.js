const { getCleanStrings, getRecipe } = require(`./helpers`)

const foodandwine = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingredients li`)
  const instructions = getCleanStrings($, `.step p`)

  return {
    sourceSite: `foodandwine.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = foodandwine
