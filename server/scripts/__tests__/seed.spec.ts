import { Recipe } from "../../db/entities"
import { Tag } from "../../db/entities"
import { User } from "../../db/entities"
import { connection, expect, syncDB } from "../../mochaSetup"
import seed from "../seed"

describe("Seed", () => {
  beforeEach(syncDB)
  afterEach(syncDB)

  it("fills the database with some sample data", async () => {
    await seed()

    const recipes = await connection.manager.find(Recipe)
    const tags = await connection.manager.find(Tag)
    const users = await connection.manager.find(User)
    const recipeTagRelations = await connection.manager
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
