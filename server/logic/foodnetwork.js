const foodnetwork = (recipe, html) => {
  recipe.title = html(`.o-AssetTitle__a-HeadlineText`)[0].children[0].data // This works, [0].text does not, don't know why

  html(`.o-Ingredients__m-Body ul li`).each(function(){
    recipe.ingredients.push(`• ${html(this).text().trim()}`)
  })
  if(recipe.ingredients.length === 0){ // /sigh other html layout
    html(`.o-Ingredients__m-Body p`).each(function(){
      recipe.ingredients.push(`• ${html(this).text().trim()}`)
    })
  }

  html(`.o-Method__m-Body ol li`).each(function(){
    recipe.instructions.push(`${html(this).text().trim()}`)
  })
  if(recipe.instructions.length === 0){ // /sigh other html layout
    html(`.o-Method__m-Body p`).each(function(){
      recipe.instructions.push(`${html(this).text().trim()}`)
    })
  }
  if(recipe.instructions[0] === `Watch how to make this recipe.`){ // to deal with the many FN.com recipes where the first "instruction" is a video link
    recipe.instructions.shift() // this is an ugly and graceless fix, but they have ugly and graceless html and I'm doing the best I can
  }
  if(recipe.instructions[recipe.instructions.length - 1].includes(`Photograph`)){ // to deal with the many FN.com recipes where the final "instruction" is a PC
    recipe.instructions.pop() // this is an ugly and graceless fix, but they have ugly and graceless html and I'm doing the best I can
  }
}

module.exports = foodnetwork
