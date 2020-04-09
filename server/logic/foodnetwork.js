const { getCleanStrings, getRecipe } = require(`./helpers`)

const foodnetwork = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.o-Ingredients__m-Body p`)
  const instructions = getCleanStrings($, `.o-Method__m-Body ol li`)

  return {
    sourceSite: `foodnetwork.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = foodnetwork
