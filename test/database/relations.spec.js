const {expect} = require(`chai`)
const Recipe = require(`../../server/db`).model(`recipe`)
const RecipeTraits = require(`../../server/db`).model(`recipeTraits`)
const User = require(`../../server/db`).model(`user`)

describe(`Relationships`, () => {
  let testUser = null
  let testRecipe = null
  before(async () => {
    try{
      await Recipe.sync({force : true})
      await RecipeTraits.sync({force : true})
      await User.sync({force : true})
      testUser = await User.create({
        email : `testUser@example.com`,
        password : `pw`,
        userName : `testUser`,
      })
      testRecipe = await Recipe.create({
        text : `recipe`,
        title : `title`,
        createdBy : 1,
      })
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await Recipe.sync({force : true})
      await RecipeTraits.sync({force : true})
      await User.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  describe(`The User-Recipe one-many relation`, () => {
    it(`exists`, () => {
      expect(testRecipe.getUsers).to.be.an(`undefined`)
      expect(testRecipe.getUser).not.to.be.an(`undefined`)
      expect(testUser.getRecipes).not.to.be.an(`undefined`)
      expect(testUser.getRecipe).to.be.an(`undefined`)
    })
  })

  describe(`The Recipe-Tag many-many relation`, () => {
    it(`exists`, () => expect(RecipeTraits).not.to.be.undefined)
  })
})
