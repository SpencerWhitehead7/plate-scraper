const thekitchn = (recipe, html) => {
  recipe.title = html(`.Recipe__title`).text().trim()
  html(`.Recipe__ingredient`).each(function() {
    recipe.ingredients.push(`${html(this).text().trim()}`)
  })
  html(`.Recipe__instruction-step`).each(function() {
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = thekitchn
