const requestPromiseNative = require(`request-promise-native`)
const cheerio = require(`cheerio`)
const fs = require(`fs`)

const seriousEatsParser = require(`./seriousEatsParser`)
const allrecipesParser = require(`./allrecipesParser`)
const epicuriousParser = require(`./epicuriousParser`)

class Page{
	constructor(url){
		this.uri = url
		this.transform = body => cheerio.load(body)
	}
}

const recipeToStr = recipe => {
	let output = `${recipe.title}\n\nIngredients\n`
	recipe.ingredients.forEach(ingredient => {output += `\n    ${ingredient}`})
	output += `\n\nInstructions\n`
	recipe.instructions.forEach((instruction, i) => {output += `\n    ${i + 1}) ${recipe.instructions[i]}`})
	output += `\n\n`
	return output
}

const scrape = url => {
	const recipe = {
		title : ``,
		ingredients : [],
		instructions : [],
	}
	const page = new Page(url)
	requestPromiseNative(page)
		.then(html => {
			// giant block of if/else or switch clauses for different websites; break all the crap under here into their own functions for each clause
			if(page.uri.includes(`seriouseats.com`) && !page.uri.includes(`seriouseats.com/recipes`)){
				console.log(`Make sure your URL is at seriouseats.com/recipes, not just seriouseats.com`)
			}else if(page.uri.includes(`seriouseats.com/recipes`)){ // SeriousEats
				seriousEatsParser(recipe, html)
			}else if(page.uri.includes(`allrecipes.com`)){ // Allrecipes
				allrecipesParser(recipe, html)
			}else if(page.uri.includes(`epicurious.com`)){
				epicuriousParser(recipe, html)
			}else{
				console.log(`Sorry, we don't support that website`)
			}
			// alright back to universals
			console.log(recipe)
			fs.appendFile(`recipes.txt`, recipeToStr(recipe), error => {
				if(error) throw error
				console.log(`Recipes updated!`)
			})
		})
		.catch(error => {console.log(error)})
}

module.exports = {
	Page,
	recipeToStr,
	scrape,
}

const testUrl = `https://www.epicurious.com/recipes/food/views/chickpea-almond-blondie-muffins`

scrape(testUrl)