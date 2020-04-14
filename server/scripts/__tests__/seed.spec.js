const { expect } = require(`chai`)
const RecipeTraits = require(`../../db`).model(`recipeTraits`)
const Recipe = require(`../../db`).model(`recipe`)
const Tag = require(`../../db`).model(`tag`)
const User = require(`../../db`).model(`user`)
const seed = require(`../../scripts/seed`)

describe(`Seed`, () => {
  let RecipeTraitsInDb = null
  let RecipeInDb = null
  let TagInDb = null
  let UserInDb = null
  before(async () => {
    try {
      await RecipeTraits.sync({ force: true })
      await Recipe.sync({ force: true })
      await Tag.sync({ force: true })
      await User.sync({ force: true })
      await seed()
      RecipeTraitsInDb = await RecipeTraits.findAll()
      RecipeInDb = await Recipe.findAll()
      TagInDb = await Tag.findAll()
      UserInDb = await User.findAll()
    } catch (error) {
      console.log(error)
    }
  })
  after(async () => {
    try {
      await RecipeTraits.sync({ force: true })
      await Recipe.sync({ force: true })
      await Tag.sync({ force: true })
      await User.sync({ force: true })
    } catch (error) {
      console.log(error)
    }
  })
  it(`fills the database with some sample data`, () => {
    expect(RecipeTraitsInDb.length).to.be.greaterThan(0)
    expect(RecipeInDb.length).to.be.greaterThan(0)
    expect(TagInDb.length).to.be.greaterThan(0)
    expect(UserInDb.length).to.be.greaterThan(0)
  })
})
