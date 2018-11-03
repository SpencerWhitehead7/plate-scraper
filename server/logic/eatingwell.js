const eatingwell = (recipe, html) => {
  recipe.title = html(`.hideOnTabletToDesktop`).text()
  html(`.checkListListItem.checkListLine span`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  recipe.ingredients = recipe.ingredients.slice(0, -2) // to deal with some html BS
  html(`.recipeDirectionsListItem`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
  recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
}

module.exports = eatingwell
