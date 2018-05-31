const requestPromiseNative = require(`request-promise-native`)
const cheerio = require(`cheerio`)
const fs = require(`fs`)

class Page{
	constructor(url){
		this.uri = url
		this.transform = body => cheerio.load(body)
	}
}

const recipeToStr = recipe => {
	let output = `${recipe.title}\n\nIngredients\n`
	recipe.ingredients.forEach((ingredient) => {output += `\n    ${ingredient}`})
	output += `\n\nInstructions\n`
	for(let i = 0; i < recipe.instructions.length; i++){
		output += `\n    ${i + 1}) ${recipe.instructions[i]}`
	}
	output += `\n\n`
	return output
}

const testUrl = `https://www.allrecipes.com/recipe/258576/crispy-tofu-bites/?clickId=right%20rail1&internalSource=rr_feed_recipe_sb&referringId=238967%20referringContentType%3Drecipe`
const testPage = new Page(testUrl)

requestPromiseNative(testPage)
	.then(($) => {
		const recipe = {
			title : ``,
			ingredients : [],
			instructions : [],
		}
		const recipeStr = ``
		// giant block of if/else clauses for different websites; break all the crap under here into their own functions for each clause
		// seriouseats clauses
		if(testPage.uri.includes(`seriouseats.com`) && !testPage.uri.includes(`seriouseats.com/recipes`)){
			console.log(`Make sure your URL is at seriouseats.com/recipes, not just seriouseats.com`)
		}else if(testPage.uri.includes(`seriouseats.com/recipes`)){
			recipe.title = ($(`h1`).text().trim())
			$(`.ingredient`).each(function(){
				recipe.ingredients.push(`• ${$(this).text().trim()}`)
			})
			$(`.recipe-procedure-text`).each(function(){
				recipe.instructions.push(`${$(this).text().trim()}`)
			})
			// Allrecipes clauses
		}else if(testPage.uri.includes(`allrecipes.com`)){
			recipe.title = ($(`h1`).text().trim())
			console.log($(`.checkList__line`).length)
			$(`.checkList__line`).each(function(){
				recipe.ingredients.push(`• ${$(this).text().trim()}`)
			})
			recipe.ingredients = recipe.ingredients.slice(0, -3) // to deal with some html BS
			$(`.recipe-directions__list--item`).each(function(){
				recipe.instructions.push(`${$(this).text().trim()}`)
			})
			recipe.instructions = recipe.instructions.slice(0, -1) // to deal with some html BS
		}else{
			console.log(`Sorry, we don't support that website`)
		}
		// alright back to the universal set NODE ONLY VERSION
		console.log(recipe)
		fs.appendFile(`recipes.txt`, recipeToStr(recipe), err => {
			if(err) throw err
			console.log(`Recipes updated!`)
		})
	})
	.catch((err) => {console.log(err)}
	)

const seriousEatsHTMLToObj = ($) => {
	recipe.title = ($(`h1`).text())
	$(`.ingredient`).each(function(){
		ingredientList.push(`• ${$(this).text().trim()}`)
	})
	recipe.ingredients = ingredientList
	$(`.recipe-procedure-text`).each(function(){
		instructionList.push(`${$(this).text().trim()}`)
	})
	recipe.instructions = instructionList
}


// epicurious
// ingredients: document.getElementsByClassName("ingredient")[0].innerText

// instructions: document.getElementsByClassName("preparation-step")[0].innerText

// thekitchn
// ingredients: document.getElementsByClassName("PostRecipeIngredientGroup__ingredient")[0].innerText

// instructions: document.getElementsByClassName("PostRecipeInstructionGroup__step")[0].innerText

// bonappetit
// ingredients: document.getElementsByClassName("ingredients__text")[0].innerText

// instructions: document.getElementsByClassName("step")[0].innerText

// foodnetwork.com
// ingredients: document.getElementsByClassName("o-Ingredients__a-ListItem")[0].innerText

// instructions: document.getElementsByClassName("o-Method__m-Body")[0].getElementsByTagName("p")[0].innerText

// geniuskitchen.com/food.com
// ingredients: document.getElementsByClassName("ingredient-list")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByClassName("expanded")[0].getElementsByTagName("li")[0].innerText

// chowhound.com
// ingredients: document.getElementsByClassName("freyja_box freyja_box81")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByTagName("ol")[0].getElementsByTagName("li")[0].innerText (need to trim off numbers)

// simplyrecipes.com
// ingredients: document.getElementsByClassName("ingredient")[0].innerText

// instructions: document.getElementsByClassName("entry-details recipe-method instructions")[0].getElementsByTagName("p")[0].innerText

// cookinglight.com
// ingredients: document.getElementsByClassName("ingredients")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByClassName("step")[0].getElementsByTagName("p")[0].innerText

// bettycrocker.com
// ingredients: document.getElementsByClassName("recipePartIngredient")[0].innerText

// instructions: document.getElementsByClassName("recipePartStepDescription")[0].innerText

// food52.com
// ingredients: document.getElementsByClassName("recipe-list")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByTagName("ol")[0].getElementsByTagName("li")[0].innerText

// jamieoliver.com
// ingredients: document.getElementsByClassName("ingred-list ")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByClassName("recipeSteps")[0].getElementsByTagName("li")[0].innerText

// eatingwell.com
// ingredients: document.getElementsByClassName("checkListListItem checkListLine ")[0].getElementsByTagName("span")[0].innerText

// instructions: document.getElementsByClassName("recipeDirectionsListItem")[0].innerText

// foodandwine.com
// ingredients: document.getElementsByClassName("ingredients")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByClassName("step")[0].getElementsByTagName("p")[0].innerText

// cooks.com (this one's a bit fucked)
// ingredients: document.getElementsByClassName("ingredient")[0].innerText

// instructions: document.getElementsByClassName("instructions")[0].innerText (will need to be tweaked for number/breaks)

// myrecipes.com
// ingredients: document.getElementsByClassName("ingredients")[0].getElementsByTagName("li")[0].innerText

// instructions: document.getElementsByClassName("step")[0].innerText (will need to be tweaked for number/breaks)

// KRAFT AND YUMMLY ARE BOTH FUCKING MONSTROUS CHALLENGES TO PARSE

const scrape = url => {
	const page = new Page(url)
	requestPromiseNative(page)
		.then(($) => {
			const recipe = {
				title : null,
				ingredients : null,
				instructions : null,
			}
			const ingredientList = []
			const instructionList = []
			// giant block of if/else clauses for different websites; break all the crap under here into their own functions for each clause
			// seriouseats clauses
			if(page.uri.includes(`seriouseats.com`) && !page.uri.includes(`seriouseats.com/recipes`)){
				console.log(`Make sure your URL is at seriouseats.com/recipes, not just seriouseats.com`)
			}else if(page.uri.includes(`seriouseats.com/recipes`)){
				recipe.title = ($(`h1`).text().trim())
				$(`.ingredient`).each(function(){
					ingredientList.push(`• ${$(this).text().trim()}`)
				})
				recipe.ingredients = ingredientList
				$(`.recipe-procedure-text`).each(function(){
					instructionList.push(`${$(this).text().trim()}`)
				})
				recipe.instructions = instructionList
			// //Allrecipes clauses
			// }else if(){

			// All other sites clauses
			}else{
				console.log(`Sorry, we don't support that website`)
			}
			// alright back to the universal set
			return recipeToStr(recipe)
		})
		.catch(err => {console.log(err)})
}

module.exports = {
	Page : Page,
	recipeToStr : recipeToStr,
	scrape : scrape,
}