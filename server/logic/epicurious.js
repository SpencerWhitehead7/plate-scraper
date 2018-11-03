const epicurious = (recipe, html) => {
  recipe.title = html(`h1`).text().trim()
  html(`.ingredient`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  html(`.preparation-step`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = epicurious
