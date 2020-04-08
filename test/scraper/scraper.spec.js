const { expect } = require(`chai`)

const expecteds = require(`./expectedResults`)

const scrape = require(`../../server/logic`)

describe(`The parsers handle`, () => {
  let actuals = []
  let i = 0

  before(async () => {
    try {
      actuals = await Promise.all(expecteds.map(testItem => scrape(testItem.sourceUrl)))
    } catch (err) {
      console.log(err)
    }
  })

  afterEach(() => { i++ })

  it(`allrecipes html0 template pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`allrecipes html1 template pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`bettycrocker pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`bonappetit pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`chowhound pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`cookinglight pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`eatingwell pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`eatingwell fallback origin pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`epicurious pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`food pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  // it('food52 pages', () => {
  //   expect(actuals[i]).to.deep.equal(expecteds[i])
  // })
  it(`foodandwine pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`foodnetwork pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`jamieoliver pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`myrecipes pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`seriouseats pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  it(`simplyrecipes pages`, () => {
    expect(actuals[i]).to.deep.equal(expecteds[i])
  })
  // it(`thekitchn pages`, () => {
  //   expect(actuals[i]).to.deep.equal(expecteds[i])
  // })
})
