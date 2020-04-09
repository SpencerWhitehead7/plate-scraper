const { getCleanStrings, getRecipe } = require(`./helpers`)

const food = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.recipe-ingredients__item`)
  const instructions = getCleanStrings($, `.recipe-directions__step`)

  return {
    sourceSite: `food.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = food
