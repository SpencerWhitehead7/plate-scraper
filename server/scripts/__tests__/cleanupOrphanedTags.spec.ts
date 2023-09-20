import { Tag } from "../../db/entities"
import {
  dataSource,
  expect,
  factoryRecipe,
  factoryTag,
  factoryUser,
  syncDB,
} from "../../mochaSetup"
import cleanupOrphanedTags from "../cleanupOrphanedTags"

describe("CleanupOrphanedTags", () => {
  beforeEach(async () => {
    await syncDB()
    const user = await dataSource.manager.save(factoryUser())
    const recipe = await dataSource.manager.save(factoryRecipe({ user }))
    await Promise.all(
      [
        factoryTag({ name: "tone", recipes: [recipe] }),
        factoryTag({ name: "ttwo" }),
      ].map((row) => dataSource.manager.save(row)),
    )
  })
  afterEach(syncDB)

  it("deletes all tags with no associations", async () => {
    const before = await dataSource.manager.find(Tag)
    await cleanupOrphanedTags(dataSource)
    const after = await dataSource.manager.find(Tag)

    expect(before.length).to.equal(2)
    expect(after.length).to.equal(1)
  })
})
