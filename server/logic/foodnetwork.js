const foodnetwork = (recipe, html) => {
	recipe.title = (html(`.o-AssetTitle__a-HeadlineText`).text().trim()
		.slice(0, -16))
	html(`.o-Ingredients__a-ListItem`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()}`)
	})
	html(`.o-Method__m-Body p`).each(function(){
		recipe.instructions.push(`${html(this).text().trim()}`)
	})
}

module.exports = foodnetwork