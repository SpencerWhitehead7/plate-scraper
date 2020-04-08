/* eslint-disable global-require */

const expect = require(`chai`).expect

const scrape = require(`../../server/logic`)

describe(`The scraping function`, () => {
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

describe(`The parsers`, () => {
  const sourceUrls = require(`./sourceUrls`)
  let counter = 0
  let i = 0
  let results = []

  before(async () => {
    try {
      const promises = []
      while (counter < sourceUrls.length) {
        promises.push(scrape(sourceUrls[counter]))
        counter++
      }
      results = await Promise.all(promises)
    } catch (err) {
      console.log(err)
    }
  })

  afterEach(() => i++)

  it(`allrecipes html0 template pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/allrecipes0`))
  })
  it(`allrecipes html1 template pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/allrecipes1`))
  })
  it(`bettycrocker pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/bettycrocker`))
  })
  it(`bonappetit pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/bonappetit`))
  })
  it(`chowhound pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/chowhound`))
  })
  it(`cookinglight pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/cookinglight`))
  })
  it(`eatingwell pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/eatingwell`))
  })
  it(`eatingwell fallback origin pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/eatingwellFallbackOrigin`))
  })
  it(`myrecipes pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/myrecipes`))
  })
  it(`epicurious pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/epicurious`))
  })
  // it('food52', () => { uncomment if I ever get it working
  //   expect(results[i]s.recipe).to.equal(require('./food52'))
  // })
  it(`foodandwine pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/foodandwine`))
  })
  it(`foodnetwork html0 template pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/foodnetwork0`))
  })
  it(`foodnetwork html1 template pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/foodnetwork1`))
  })
  // There may be other, as yet unknown, foodnetwork html layouts, but I'll add them as I find them.
  it(`geniuskitchen pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/geniuskitchen`))
  })
  it(`jamieoliver pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/jamieoliver`))
  })
  it(`thekitchn pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/thekitchn`))
  })
  it(`simplyrecipes pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/simplyrecipes`))
  })
  it(`seriouseats pages are parsed correctly`, () => {
    expect(results[i].recipe).to.equal(require(`./correct-recipes/seriouseats`))
  })
})
