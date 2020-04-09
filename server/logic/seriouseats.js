const { getCleanStrings, getRecipe } = require(`./helpers`)

const seriousEats = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingredient`)
  const instructions = getCleanStrings($, `.recipe-procedure-text`)

  return {
    sourceSite: `seriouseats.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = seriousEats
