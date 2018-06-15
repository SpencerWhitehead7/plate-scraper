const foodandwine = (recipe, html) => {
  recipe.title = (html(`h1`).text())
  html(`.ingredients li`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  html(`.step`).each(function(){
    if(html(this).attr(`itemprop`) === `recipeInstructions`){
      recipe.instructions.push(`${html(this).children(`p`).text()
        .trim()}`)
    }
  })
}

module.exports = foodandwine