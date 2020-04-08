const foodnetwork = (recipe, html) => {
  recipe.title = html(`h1`).text().trim()
  html(`.o-Ingredients__m-Body p`).each(function() {
    recipe.ingredients.push(html(this).text().trim())
  })
  html(`.o-Method__m-Body ol li`).each(function() {
    recipe.instructions.push(html(this).text().trim())
  })
}

module.exports = foodnetwork
