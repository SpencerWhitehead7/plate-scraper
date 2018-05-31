const simplyrecipes = (recipe, html) => {
	recipe.title = (html(`h1`).text())
	html(`.ingredient`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()}`)
	})
	html(`.entry-details.recipe-method.instructions p`).each(function(){
		if(`${html(this).text().trim()}` !== ``){
			recipe.instructions.push(`${html(this).text().trim()}`
				.replace(/^[\s\d]+/, ``)) // to deal with inline numbers
		}
	})
}

module.exports = simplyrecipes