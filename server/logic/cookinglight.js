const cookinglight = (recipe, html) => {
  recipe.title = html(`h1`).text()
  html(`.ingredients li`).each(function() {
    recipe.ingredients.push(`${html(this).text().trim()}`)
  })
  html(`.step p`).each(function() {
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = cookinglight
