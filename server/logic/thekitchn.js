const thekitchn = (recipe, html) => {
  recipe.title = html(`h1`).text().trim()
  html(`.PostRecipeIngredientGroup__ingredient`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  html(`.PostRecipeInstructionGroup__step`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = thekitchn
