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
      const [recipe, user] = await Promise.all([
        createTestInstance(Recipe, SUCCESS,
          [`text`, `recipe`],
          [`title`, `title`],
          [`createdBy`, `testUser`]),
        createTestInstance(User, SUCCESS,
          [`email`, `testUser@example.com`],
          [`password`, `pw`]),
      ])
      await recipe.setUser(user.id)
      expect(recipe.userId).to.equal(user.id)
    })
  })

  describe(`The Recipe-Tag many-many relation`, () => {
    it(`the relation exists`, () => expect(RecipeTraits).not.to.be.undefined)
  })
})
