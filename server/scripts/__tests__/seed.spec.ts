import { Recipe } from "../../db/entities"
import { Tag } from "../../db/entities"
import { User } from "../../db/entities"
import { dataSource, expect, syncDB } from "../../mochaSetup"
import seed from "../seed"

describe("Seed", () => {
  beforeEach(syncDB)
  afterEach(syncDB)

  it("fills the database with some sample data", async () => {
    await seed(dataSource)

    const recipes = await dataSource.manager.find(Recipe)
    const tags = await dataSource.manager.find(Tag)
    const users = await dataSource.manager.find(User)
    const recipeTagRelations = await dataSource.manager
      .createQueryBuilder()
      .select("tag")
      .from(Tag, "tag")
      .innerJoinAndSelect("tag.recipes", "recipe")
      .getMany()

    expect(recipes.length).to.be.greaterThan(0)
    expect(tags.length).to.be.greaterThan(0)
    expect(users.length).to.be.greaterThan(0)
    expect(recipeTagRelations.length).to.be.greaterThan(0)
  })
})
