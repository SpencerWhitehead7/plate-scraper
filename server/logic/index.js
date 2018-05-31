const requestPromiseNative = require(`request-promise-native`)
const cheerio = require(`cheerio`)
// const fs = require(`fs`)

// Parsers
const seriousEats = require(`./seriousEats`)
const allrecipes = require(`./allrecipes`)
const epicurious = require(`./epicurious`)
const thekitchn = require(`./thekitchn`)

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
	return requestPromiseNative(page)
		.then(html => {
			const parserLoader = parser => parser(recipe, html)
			// Deals with the edge case seriousEats pages
			if(page.uri.includes(`seriouseats.com`) && !page.uri.includes(`seriouseats.com/recipes`)){
				console.log(`Make sure your URL is at seriouseats.com/recipes, not just seriouseats.com`)

				// Clauses to let you use different parsers for different websites
			}else if(page.uri.includes(`seriouseats.com/recipes`)){ // SeriousEats
				parserLoader(seriousEats)
			}else if(page.uri.includes(`allrecipes.com`)){ // Allrecipes
				parserLoader(allrecipes)
			}else if(page.uri.includes(`epicurious.com`)){ // Epicurious
				parserLoader(epicurious)
			}else if(page.uri.includes(`thekitchn.com`)){ // theKitchn
				parserLoader(thekitchn)
			}
			// else{
			// 	console.log(`Sorry, we don't support that website`)
			// }
			// // alright back to universals
			const recipeStr = `Source: ${page.uri}\n\n${recipeToStr(recipe)}`
			return recipeStr
			// fs.appendFile(`recipes.txt`, recipeStr, error => {
			// 	if(error) throw error
			// 	console.log(`Recipes updated!`)
			// })
		})
		.catch(error => {console.log(error)})
}

module.exports = scrape

// const testUrl = `https://www.thekitchn.com/recipe-chicken-amp-tomato-no-boil-pasta-bake-157548`

// scrape(testUrl)