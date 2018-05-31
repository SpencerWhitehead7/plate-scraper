const chowhound = (recipe, html) => {
	recipe.title = (html(`h1`).text())
	html(`.freyja_box.freyja_box81 ul li`).each(function(){
		recipe.ingredients.push(`• ${html(this).text().trim()}`)
	})
	html(`.freyja_box.freyja_box82 ol li`).each(function(){
		recipe.instructions.push(`${html(this).text().trim()
			.slice(1)}`)
	})
}

module.exports = chowhound