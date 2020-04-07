const allrecipes = (recipe, html) => {
  // two known recipe page templates; one without a main, one with
  if (!html(`main`).length) {
    recipe.title = html(`h1`).text().trim()
    html(`.checkList__line label`).each(function() {
      recipe.ingredients.push(`${html(this).text().trim()}`)
    })
    recipe.ingredients = recipe.ingredients.slice(0, -3) // to deal with some html BS
    html(`.recipe-directions__list--item`).each(function() {
      recipe.instructions.push(`${html(this).text().trim()}`)
    })
    recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
  } else if (html(`main`).length) {
    recipe.title = html(`.headline-wrapper`).text().trim()
    html(`.ingredients-item`).each(function() {
      recipe.ingredients.push(`${html(this).text().trim()}`)
    })
    html(`.section-body`, `.instructions-section`).each(function() {
      recipe.instructions.push(`${html(this).text().trim()}`)
    })
  }
}

module.exports = allrecipes
