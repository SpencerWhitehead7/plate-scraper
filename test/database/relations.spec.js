const {expect} = require(`chai`)
const db = require(`../../server/db`)
const Recipe = db.model(`recipe`)
const User = db.model(`user`)
const RecipeTraits = db.model(`recipeTraits`)

const {SUCCESS, createTestInstance} = require(`./logic`)

describe(`Relationships`, () => {
  before(async () => {
    try{
      await db.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`The User-Recipe one-many relation`, () => {
    it(`the relation exists`, async () => {
      const [recipe1, recipe2, user] = await Promise.all([
        createTestInstance(Recipe, SUCCESS,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, `testUser`]),
        createTestInstance(Recipe, SUCCESS,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, `testUser`]),
        createTestInstance(User, SUCCESS,
          [`email`, `testUser@example.com`],
          [`password`, `pw`]),
      ])
      await recipe1.setUser(user.id)
      await recipe2.setUser(user.id)
      expect(await user.countRecipes()).to.equal(2)
    })
  })

  describe(`The Recipe-Tag many-many relation`, () => {
    it(`the relation exists`, () => expect(RecipeTraits).not.to.be.undefined)
  })
})
