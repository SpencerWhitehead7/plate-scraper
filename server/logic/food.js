const food = (recipe, html) => {
  recipe.title = html(`h1`).text()
  html(`.recipe-ingredients__item`).each(function() {
    recipe.ingredients.push(html(this)
      .text()
      .trim()
      .replace(/\s+/g, ` `))
  })
  html(`.recipe-directions__step`).each(function() {
    recipe.instructions.push(html(this).text().trim())
  })
}

module.exports = food
