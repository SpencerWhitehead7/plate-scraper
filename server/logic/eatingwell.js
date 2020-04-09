const { getCleanStrings, getRecipe } = require(`./helpers`)

const eatingwell = ($, url) => {
  let title
  let ingredients
  let instructions

  if ($(`body`).hasClass(`template-recipe`)) {
    title = getCleanStrings($, `.headline-wrapper`)
    ingredients = getCleanStrings($, `.ingredients-item`)
    instructions = getCleanStrings($, `.section-body`, `.instructions-section`)
  } else if (!$(`body`).hasClass(``)) {
    title = getCleanStrings($, `.hideOnTabletToDesktop`)
    ingredients = getCleanStrings($, `.checkListListItem.checkListLine span`)
    instructions = getCleanStrings($, `.recipeDirectionsListItem`)
  }
  return {
    sourceSite: `eatingwell.com`,
    sourceUrl: url,
    title: title[0],
    recipe: getRecipe(url, title, ingredients, instructions),
  }
}

module.exports = eatingwell
