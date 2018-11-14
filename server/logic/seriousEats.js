const seriousEats = (recipe, html) => {
  recipe.title = html(`h1`).text()
  html(`.ingredient`).each(function(){
    recipe.ingredients.push(`${html(this).text().trim()}`)
  })
  html(`.recipe-procedure-text`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = seriousEats
