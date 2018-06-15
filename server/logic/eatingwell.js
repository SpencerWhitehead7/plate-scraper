const eatingwell = (recipe, html) => {
  recipe.title = (html(`h1`).text())
  html(`.checkListListItem.checkListLine > span`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  html(`.recipeDirectionsListItem`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
  recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
}

module.exports = eatingwell

const eatingwell = recipe => {
  recipe.title = ($(`h1`).text())
  $(`.checkListListItem.checkListLine > span`).each(function(){
    recipe.ingredients.push(`• ${$(this).text().trim()}`)
  })
  $(`.recipeDirectionsListItem`).each(function(){
    recipe.instructions.push(`${$(this).text().trim()}`)
  })
  recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
}