const {expect} = require(`chai`)
const RecipeTraits = require(`../../server/db`).model(`recipeTraits`)
const Recipe = require(`../../server/db`).model(`recipe`)
const Tag = require(`../../server/db`).model(`tag`)
const cleanupOrphanedTags = require(`../../server/scripts/cleanupOrphanedTags`)

describe(`CleanupOrphanedTags`, () => {
  before(async () => {
    try{
      const promises = []
      await RecipeTraits.sync({force : true})
      await Recipe.sync({force : true})
      await Tag.sync({force : true})
      promises.push(Recipe.create({
        text : `text1`,
        title : `title1`,
        createdBy : 1,
      }))
      promises.push(Tag.create({name : `ttone`}))
      promises.push(Tag.create({name : `tttwo`}))
      const [recipe, tag1] = await Promise.all(promises)
      await recipe.addTag(tag1)
    }catch(err){
      console.log(err)
    }
  })
  after(async () => {
    try{
      await RecipeTraits.sync({force : true})
      await Recipe.sync({force : true})
      await Tag.sync({force : true})
    }catch(err){
      console.log(err)
    }
  })

  it(`deletes all tags with no associations`, async () => {
    const start = await Tag.findAll()
    await cleanupOrphanedTags()
    const end = await Tag.findAll()
    expect(start.length - end.length).to.equal(1)
  })
})
