const allrecipesParser = (recipe, html) => {
	recipe.title = (html(`h1`).text().trim())
	html(`.checkList__line`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()}`)
	})
	recipe.ingredients = recipe.ingredients.slice(0, -3) // to deal with some html BS
	html(`.recipe-directions__list--item`).each(function(){
		recipe.instructions.push(`${html(this).text().trim()}`)
	})
	recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
	return recipe
}

module.exports = allrecipesParser