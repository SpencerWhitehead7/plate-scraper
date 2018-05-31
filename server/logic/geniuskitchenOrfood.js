const geniuskitchenOrfood = (recipe, html) => {
	recipe.title = (html(`h1`).text())
	html(`.ingredient-list li`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()}`)
	})
	html(`ol li`).slice(0, -1).each(function(){
		recipe.instructions.push(`${html(this).text().trim()}`)
	})
}

module.exports = geniuskitchenOrfood