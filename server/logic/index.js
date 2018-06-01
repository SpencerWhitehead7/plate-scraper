const requestPromiseNative = require(`request-promise-native`)
const cheerio = require(`cheerio`)

// Parsers
const allrecipes = require(`./allrecipes`)
const bettycrocker = require(`./bettycrocker`)
const bonappetit = require(`./bonappetit`)
const chowhound = require(`./chowhound`)
const cookinglight = require(`./cookinglight`)
const eatingwell = require(`./eatingwell`)
const epicurious = require(`./epicurious`)
const food52 = require(`./food52`)
const foodandwine = require(`./foodandwine`)
const foodnetwork = require(`./foodnetwork`)
const geniuskitchenOrfood = require(`./geniuskitchenOrfood`)
const jamieoliver = require(`./jamieoliver`)
const myrecipes = require(`./myrecipes`)
const seriousEats = require(`./seriousEats`)
const simplyrecipes = require(`./simplyrecipes`)
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
	/* eslint-disable complexity */ // Ignores "massively" complex parsers clause
		.then(html => {
			const parserLoader = parser => parser(recipe, html)
			// Deals with the edge case seriousEats pages
			if(page.uri.includes(`seriouseats.com`) && !page.uri.includes(`seriouseats.com/recipes`)){
				return `Make sure your URL is at seriouseats.com/recipes, not just seriouseats.com`
			// Clauses to let you use different parsers for different websites
			}else if(page.uri.includes(`allrecipes.com`)){ // allrecipes
				parserLoader(allrecipes)
			}else if(page.uri.includes(`bettycrocker.com`)){ // bettycrocker
				parserLoader(bettycrocker)
			}else if(page.uri.includes(`bonappetit.com`)){ // bonappetit
				parserLoader(bonappetit)
			}else if(page.uri.includes(`chowhound.com`)){ // chowhound
				parserLoader(chowhound)
			}else if(page.uri.includes(`cookinglight.com`)){ // cookinglight
				parserLoader(cookinglight)
			}else if(page.uri.includes(`eatingwell.com`)){ // eatingwell
				parserLoader(eatingwell)
			}else if(page.uri.includes(`epicurious.com`)){ // epicurious
				parserLoader(epicurious)
			}else if(page.uri.includes(`food52.com`)){ // food52
				parserLoader(food52)
			}else if(page.uri.includes(`foodandwine.com`)){ // foodandwine
				parserLoader(foodandwine)
			}else if(page.uri.includes(`foodnetwork.com`)){ // foodnetwork
				parserLoader(foodnetwork)
			}else if(page.uri.includes(`geniuskitchen.com`)){ // geniuskitchen/food
				parserLoader(geniuskitchenOrfood)
			}else if(page.uri.includes(`jamieoliver.com`)){ // jamieoliver
				parserLoader(jamieoliver)
			}else if(page.uri.includes(`myrecipes.com`)){ // myrecipes
				parserLoader(myrecipes)
			}else if(page.uri.includes(`seriouseats.com/recipes`)){ // seriouseats
				parserLoader(seriousEats)
			}else if(page.uri.includes(`simplyrecipes.com`)){ // simplyrecipes
				parserLoader(simplyrecipes)
			}else if(page.uri.includes(`thekitchn.com`)){ // thekitchn
				parserLoader(thekitchn)
			}else{
				return `Sorry, we don't support that website`
			}
			const recipeStr = `Source: ${page.uri}\n\n${recipeToStr(recipe)}`
			return recipeStr
		})
	/* eslint-enable complexity */
		.catch(error => {console.log(error)})
}

module.exports = scrape