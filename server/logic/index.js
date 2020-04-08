const axios = require(`axios`)
const cheerio = require(`cheerio`)

// Parsers
const allrecipes = require(`./allrecipes`)
const bettycrocker = require(`./bettycrocker`)
const bonappetit = require(`./bonappetit`)
const chowhound = require(`./chowhound`)
const cookinglight = require(`./cookinglight`)
const eatingwell = require(`./eatingwell`)
const epicurious = require(`./epicurious`)
const food = require(`./food`)
// const food52 = require(`./food52`) // uncomment if I ever get it working
const foodandwine = require(`./foodandwine`)
const foodnetwork = require(`./foodnetwork`)
const jamieoliver = require(`./jamieoliver`)
const myrecipes = require(`./myrecipes`)
const seriousEats = require(`./seriousEats`)
const simplyrecipes = require(`./simplyrecipes`)
// const thekitchn = require(`./thekitchn`) // uncomment if I ever get it working

const recipeToStr = (url, recipe) => {
  let output = `Source: ${url}\n\n${recipe.title}\n\nIngredients\n`
  recipe.ingredients.forEach(ingredient => { output += `\n${ingredient}` })
  output += `\n\nInstructions\n`
  recipe.instructions.forEach(instruction => { output += `\n${instruction}\n` })
  return output
}

const scrape = async url => {
  const recipe = {
    title: ``,
    ingredients: [],
    instructions: [],
  }
  const recipeData = {
    sourceSite: ``,
    sourceUrl: url,
    title: ``,
    recipe: ``,
  }
  try {
    const { data } = await axios.get(url)
    const html = cheerio.load(data)
    const parserLoader = (parser, sourceSite) => {
      parser(recipe, html)
      recipeData.sourceSite = sourceSite
    }
    if (url.includes(`allrecipes.com`)) { // allrecipes
      parserLoader(allrecipes, `allrecipes.com`)
    } else if (url.includes(`bettycrocker.com`)) { // bettycrocker
      parserLoader(bettycrocker, `bettycrocker.com`)
    } else if (url.includes(`bonappetit.com`)) { // bonappetit
      parserLoader(bonappetit, `bonappetit.com`)
    } else if (url.includes(`chowhound.com`)) { // chowhound
      parserLoader(chowhound, `chowhound.com`)
    } else if (url.includes(`cookinglight.com`)) { // cookinglight
      parserLoader(cookinglight, `cookinglight.com`)
    } else if (url.includes(`eatingwell.com`)) { // eatingwell
      parserLoader(eatingwell, `eatingwell.com`)
    } else if (url.includes(`epicurious.com`)) { // epicurious
      parserLoader(epicurious, `epicurious.com`)
    } else if (url.includes(`food.com`)) {
      parserLoader(food, `food.com`)
    // } else if (url.includes(`food52.com`)) { // food52 uncomment if I ever get it working
    //   parserLoader(food52, `food52.com`)
    } else if (url.includes(`foodandwine.com`)) { // foodandwine
      parserLoader(foodandwine, `foodandwine.com`)
    } else if (url.includes(`foodnetwork.com`)) { // foodnetwork
      parserLoader(foodnetwork, `foodnetwork.com`)
    } else if (url.includes(`jamieoliver.com`)) { // jamieoliver
      parserLoader(jamieoliver, `jamieoliver.com`)
    } else if (url.includes(`myrecipes.com`)) { // myrecipes
      parserLoader(myrecipes, `myrecipes.com`)
    } else if (url.includes(`seriouseats.com/recipes`)) { // seriouseats
      parserLoader(seriousEats, `seriouseats.com`)
    } else if (url.includes(`simplyrecipes.com`)) { // simplyrecipes
      parserLoader(simplyrecipes, `simplyrecipes.com`)
    } // else if (url.includes(`thekitchn.com`)) { // thekitchn
    //   parserLoader(thekitchn, `thekitchn.com`)
    // }
    recipeData.title = recipe.title
    recipeData.recipe = recipeToStr(url, recipe)
  } catch (err) {
    console.log(err)
  }
  return recipeData
}

module.exports = scrape
