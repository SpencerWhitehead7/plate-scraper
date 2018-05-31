const jamieoliver = (recipe, html) => {
	recipe.title = (html(`h1`).text())
	html(`.ingred-list li`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()
			.replace(/\s\s+/g, ` `)}`)
	})
	html(`.recipeSteps li`).each(function(){
		recipe.instructions.push(`${html(this).text().trim()}`)
	})
}

module.exports = jamieoliver