const { getCleanStrings, getRecipe } = require(`./helpers`)

const allrecipes = ($, url) => {
  let title
  let ingredients
  let instructions

  // two known recipe page templates; one without a main, one with
  if (!$(`main`).length) {
    title = getCleanStrings($, `h1`)
    ingredients = getCleanStrings($, `.checkList__line label`)
      .slice(0, -2) // to deal with some HTML BS
    instructions = getCleanStrings($, `.recipe-directions__list--item`)
  } else {
    title = getCleanStrings($, `.headline-wrapper`)
    ingredients = getCleanStrings($, `.ingredients-item`)
    instructions = getCleanStrings($, `.section-body`, `.instructions-section`)
  }

  return {
    sourceSite: `allrecipes.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = allrecipes
