const { getCleanStrings, getRecipe } = require(`./helpers`)

const epicurious = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingredient`)
  const instructions = getCleanStrings($, `.preparation-step`)

  return {
    sourceSite: `epicurious.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = epicurious
