const { getCleanStrings, getRecipe } = require(`./helpers`)

const cookinglight = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingredients li`)
  const instructions = getCleanStrings($, `.step p`)

  return {
    sourceSite: `cookinglight.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = cookinglight
