const bonappetit = (recipe, html) => {
  recipe.title = (html(`h1`).text())
  html(`.ingredients__text`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  html(`.step`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = bonappetit