import {
  dataSource,
  expect,
  factoryRecipe,
  factoryTag,
  factoryUser,
  syncDB,
} from "../../../../mochaSetup"
import { Recipe } from "../recipe"
import { Tag } from "../tag"
import { User } from "../user"

describe("Recipe Entity", () => {
  let user: User

  beforeEach(async () => {
    try {
      await syncDB()
      user = await dataSource.manager.save(factoryUser())
    } catch (err) {
      console.log(err)
    }
  })

  it("entity and fields exist", async () => {
    const recipe = await dataSource.manager.save(factoryRecipe({ user }))
    expect(Recipe).to.exist
    expect(recipe.text).to.exist
    expect(recipe.title).to.exist
    expect(recipe.sourceSite).to.exist
    expect(recipe.sourceUrl).to.exist
    expect(recipe.createdBy).to.exist
    expect(recipe.forkedCount).to.exist
    expect(recipe.userId).to.exist
  })

  describe("Fields validate data", () => {
    it("text rejects empty strings", async () => {
      const r = factoryRecipe({ user, text: "" })
      await expect(dataSource.manager.save(r)).to.be.rejected
    })
    it("title rejects empty strings", async () => {
      const r = factoryRecipe({ user, title: "" })
      await expect(dataSource.manager.save(r)).to.be.rejected
    })
    it("sourceSite rejects empty strings", async () => {
      const r = factoryRecipe({ user, sourceSite: "" })
      await expect(dataSource.manager.save(r)).to.be.rejected
    })
    it("sourceSite defaults to 'upload'", async () => {
      const r = await dataSource.manager.save(factoryRecipe({ user }))
      expect(r.sourceSite).to.equal("upload")
    })
    it("sourceUrl rejects empty strings", async () => {
      const r = factoryRecipe({ user, sourceUrl: "" })
      await expect(dataSource.manager.save(r)).to.be.rejected
    })
    it("sourceUrl defaults to 'upload'", async () => {
      const r = await dataSource.manager.save(factoryRecipe({ user }))
      expect(r.sourceUrl).to.equal("upload")
    })
    it("forkedCount defaults to 0", async () => {
      const r = await dataSource.manager.save(factoryRecipe({ user }))
      expect(r.forkedCount).to.equal(0)
    })
  })

  describe("Deletion behaviors", () => {
    it("deleting a recipe also deletes the recipe's rows in the tag join table", async () => {
      const getAllRecipeTagJoinRows = async () =>
        await dataSource.manager
          .createQueryBuilder()
          .select("tag")
          .from(Tag, "tag")
          .innerJoinAndSelect("tag.recipes", "recipe")
          .getMany()

      const [tag1, tag2] = await Promise.all(
        [factoryTag({ name: "abc" }), factoryTag({ name: "def" })].map((r) =>
          dataSource.manager.save(r),
        ),
      )

      const [recipe1] = await Promise.all(
        [
          factoryRecipe({ user, tags: [tag1] }),
          factoryRecipe({ user, tags: [tag2] }),
        ].map((r) => dataSource.manager.save(r)),
      )

      const originalTags = await getAllRecipeTagJoinRows()
      await dataSource.manager.delete(Recipe, recipe1.id)
      const tagsAfterDelete = await getAllRecipeTagJoinRows()

      expect(originalTags).to.have.lengthOf(2)
      expect(originalTags.map((t) => t.name)).to.include(tag1.name)
      expect(tagsAfterDelete).to.have.lengthOf(1)
      expect(tagsAfterDelete.map((t) => t.name)).not.to.include(tag1.name)
    })
    xit("if a tag no longer applies to any recipes after a recipe is deleted, the tag is deleted", async () => {
      // implement if I ever figure out how to do this; it will probably require writing custom queries with the queryBuilder, which would be properly implemented and tested by the delete endpoint
      const getAllTags = async () => await dataSource.manager.find(Tag)

      const [tag1, tag2] = await Promise.all(
        [factoryTag({ name: "abc" }), factoryTag({ name: "def" })].map((r) =>
          dataSource.manager.save(r),
        ),
      )

      const [recipe1] = await Promise.all(
        [
          factoryRecipe({ user, tags: [tag1] }),
          factoryRecipe({ user, tags: [tag2] }),
        ].map((r) => dataSource.manager.save(r)),
      )

      const originalTags = await getAllTags()
      await dataSource.manager.delete(Recipe, recipe1.id)
      const tagsAfterDelete = await getAllTags()

      expect(originalTags).to.have.lengthOf(2)
      expect(originalTags.map((t) => t.name)).to.include(tag1.name)
      expect(tagsAfterDelete).to.have.lengthOf(1)
      expect(tagsAfterDelete.map((t) => t.name)).not.to.include(tag1.name)
    })
  })
})
