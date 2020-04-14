const { expect } = require(`chai`)
const RecipeTraits = require(`../../db`).model(`recipeTraits`)
const Recipe = require(`../../db`).model(`recipe`)
const Tag = require(`../../db`).model(`tag`)
const cleanupOrphanedTags = require(`../cleanupOrphanedTags`)

describe(`CleanupOrphanedTags`, () => {
  before(async () => {
    try {
      await RecipeTraits.sync({ force: true })
      await Recipe.sync({ force: true })
      await Tag.sync({ force: true })
      const [recipe, tag1] = await Promise.all([
        Recipe.create({
          text: `text1`,
          title: `title1`,
          createdBy: 1,
        }),
        Tag.create({ name: `ttone` }),
        Tag.create({ name: `tttwo` }),
      ])
      await recipe.addTag(tag1)
    } catch (err) {
      console.log(err)
    }
  })
  after(async () => {
    try {
      await RecipeTraits.sync({ force: true })
      await Recipe.sync({ force: true })
      await Tag.sync({ force: true })
    } catch (err) {
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
