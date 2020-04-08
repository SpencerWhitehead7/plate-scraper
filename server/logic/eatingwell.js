const eatingwell = (recipe, html) => {
  if (html(`body`).hasClass(`template-recipe`)) {
    recipe.title = html(`.headline-wrapper`).text().trim()
    html(`.ingredients-item`).each(function() {
      recipe.ingredients.push(html(this).text().trim())
    })
    html(`.section-body`, `.instructions-section`).each(function() {
      recipe.instructions.push(html(this).text().trim())
    })
  } else if (!html(`body`).hasClass(``)) {
    recipe.title = html(`.hideOnTabletToDesktop`).text()
    html(`.checkListListItem.checkListLine span`).each(function() {
      recipe.ingredients.push(`${html(this).text().trim()}`)
    })
    recipe.ingredients = recipe.ingredients.slice(0, -2) // to deal with some html BS
    html(`.recipeDirectionsListItem`).each(function() {
      recipe.instructions.push(`${html(this).text().trim()}`)
    })
    recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
  }
}

module.exports = eatingwell
