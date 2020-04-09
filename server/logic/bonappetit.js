const { getCleanStrings, getRecipe } = require(`./helpers`)

const boneappetit = ($, url) => {
  const title = getCleanStrings($, `h1`)
  const ingredients = getCleanStrings($, `.ingredients__text`)
  const instructions = getCleanStrings($, `.step`)

  return {
    sourceSite: `bonappetit.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = boneappetit
