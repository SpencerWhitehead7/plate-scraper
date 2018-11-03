/* eslint-disable global-require */

const expect = require(`chai`).expect

const scrape = require(`../server/logic`)

describe(`the scraping function`, () => {
  let result = {}
  before(async () => {
    result = await scrape(`https://www.allrecipes.com/recipe/22918/pop-cake/`)
  })

  it(`should return an object`, () => {
    expect(result).to.be.a(`object`)
  })
  it(`the object should have a sourceSite property set to the root address of the recipe's url`, () => {
    expect(result.sourceSite).to.equal(`allrecipes.com`)
  })
  it(`the object should have a sourceUrl property set to the recipe's url`, () => {
    expect(result.sourceUrl).to.equal(`https://www.allrecipes.com/recipe/22918/pop-cake/`)
  })
  it(`the object should have a title property set to the recipe's title`, () => {
    expect(result.title).to.equal(`Pop Cake`)
  })
  it(`the object should have a recipe property set to the recipe's formatted text with a source note`, () => {
    expect(result.recipe).to.equal(require(`./correct-recipes/allrecipes`))
  })
})

describe(`the parsers`, () => {
  const sourceUrls = require(`./correct-recipes/sourceUrls`)
  let counter = 0
  let i = 0
  let results = []

  before(async () => {
    try{
      const promises = []
      while(counter < sourceUrls.length){
        promises.push(scrape(sourceUrls[counter]))
        counter++
      }
      results = await Promise.all(promises)
    }catch(err){
      console.log(err)
    }
  })

  afterEach(() => i++)

  it(`allrecipes`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/allrecipes`))
  })
  it(`bettycrocker`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/bettycrocker`))
  })
  it(`bonappetit`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/bonappetit`))
  })
  it(`chowhound`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/chowhound`))
  })
  it(`cookinglight`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/cookinglight`))
  })
  it(`eatingwell`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/eatingwell`))
  })
  it(`myrecipes`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/myrecipes`))
  })
  it(`epicurious`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/epicurious`))
  })
  // it('food52', () => { uncomment if I ever get it working
  //   expect(results[i]s.recipe).to.equal(require('./food52'))
  // })
  it(`foodandwine`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/foodandwine`))
  })
  it(`foodnetwork html0`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/foodnetwork0`))
  })
  it(`foodnetwork html1`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/foodnetwork1`))
  })
  // There may be other, as yet unknown, foodnetwork html layouts, but I'll add them as I find them.
  it(`geniuskitchen`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/geniuskitchen`))
  })
  it(`jamieoliver`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/jamieoliver`))
  })
  it(`thekitchn`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/thekitchn`))
  })
  it(`simplyrecipes`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/simplyrecipes`))
  })
  it(`seriouseats`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/seriouseats`))
  })
})
