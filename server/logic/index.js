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

const scrape = async url => {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)

    if (url.includes(`allrecipes.com`)) {
      return allrecipes($, url)
    } else if (url.includes(`bettycrocker.com`)) {
      return bettycrocker($, url)
    } else if (url.includes(`bonappetit.com`)) {
      return bonappetit($, url)
    } else if (url.includes(`chowhound.com`)) {
      return chowhound($, url)
    } else if (url.includes(`cookinglight.com`)) {
      return cookinglight($, url)
    } else if (url.includes(`eatingwell.com`)) {
      return eatingwell($, url)
    } else if (url.includes(`epicurious.com`)) {
      return epicurious($, url)
    } else if (url.includes(`food.com`)) {
      return food($, url)
    // } else if (url.includes(`food52.com`)) { // uncomment if I ever get it working
    //   return food52($, url)
    } else if (url.includes(`foodandwine.com`)) {
      return foodandwine($, url)
    } else if (url.includes(`foodnetwork.com`)) {
      return foodnetwork($, url)
    } else if (url.includes(`jamieoliver.com`)) {
      return jamieoliver($, url)
    } else if (url.includes(`myrecipes.com`)) {
      return myrecipes($, url)
    } else if (url.includes(`seriouseats.com/recipes`)) {
      return seriousEats($, url)
    } else if (url.includes(`simplyrecipes.com`)) {
      return simplyrecipes($, url)
    // } else if (url.includes(`thekitchn.com`)) { // uncomment if I ever get it working
    //   return thekitchn($, url)
    } else {
      return null
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = scrape
