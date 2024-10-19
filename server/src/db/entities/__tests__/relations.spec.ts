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

describe("Relations", () => {
  let user: User

  beforeEach(async () => {
    try {
      await syncDB()
      user = await dataSource.manager.save(factoryUser())
    } catch (err) {
      console.log(err)
    }
  })

  afterEach(syncDB)

  it("The User-Recipe one-many relation exists", async () => {
    await Promise.all(
      [factoryRecipe({ user }), factoryRecipe({ user })].map((r) =>
        dataSource.manager.save(r),
      ),
    )

    const savedUser = await dataSource.manager.findOneOrFail(User, {
      where: { id: 1 },
      relations: { recipes: true },
    })

    expect(savedUser.recipes.map((r) => r.id)).to.have.members([1, 2])
  })

  it("The Recipe-Tag many-many relation exists", async () => {
    const [tag1, tag2] = await Promise.all(
      [factoryTag({ name: "abc" }), factoryTag({ name: "def" })].map((r) =>
        dataSource.manager.save(r),
      ),
    )

    await Promise.all(
      [
        factoryRecipe({ user, tags: [tag1, tag2] }),
        factoryRecipe({ user, tags: [tag1, tag2] }),
      ].map((r) => dataSource.manager.save(r)),
    )

    const tags = await dataSource.manager
      .createQueryBuilder()
      .select("tag")
      .from(Tag, "tag")
      .innerJoinAndSelect("tag.recipes", "recipe")
      .getMany()

    const recipes = await dataSource.manager
      .createQueryBuilder()
      .select("recipe")
      .from(Recipe, "recipe")
      .innerJoinAndSelect("recipe.tags", "tag")
      .getMany()

    expect(tags).to.have.lengthOf(2)
    tags.forEach((tag) => {
      expect(tag.recipes.map((r) => r.id)).to.have.members([1, 2])
    })

    expect(recipes).to.have.lengthOf(2)
    recipes.forEach((recipe) => {
      expect(recipe.tags.map((t) => t.name)).to.have.members(["abc", "def"])
    })
  })
})
