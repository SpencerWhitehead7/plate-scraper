const foodnetwork = (recipe, html) => {
	recipe.title = (html(`.o-AssetTitle__a-HeadlineText`).text().trim()
		.slice(0, -16))
	html(`.o-Ingredients__a-ListItem`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()}`)
	})
	html(`.o-Method__m-Body p`).each(function(){
		recipe.instructions.push(`${html(this).text().trim()}`)
	})
	if(recipe.instructions[recipe.instructions.length - 1].includes(`Photographs by`)){ // to deal with the many FN.com recipes where the final "instruction" is a PC
		recipe.instructions = recipe.instructions.slice(0, -1) // this is an ugly and graceless fix, but they have ugly and graceless html and I'm doing the best I can
	}
}

module.exports = foodnetwork