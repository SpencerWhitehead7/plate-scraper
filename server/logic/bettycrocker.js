const bettycrocker = (recipe, html) => {
  recipe.title = html(`h1`).text()
  html(`.recipePartIngredient`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`
      .replace(/\s\s+/g, ` `)) // to deal with some html whitespace BS
  })
  html(`.recipePartStepDescription`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
}

module.exports = bettycrocker
