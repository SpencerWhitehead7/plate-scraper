import {
  dataSource,
  expect,
  factoryRecipe,
  factoryTag,
  factoryUser,
  syncDB,
} from "../../mochaSetup"
import { Tag } from "../../src/db/entities"
import cleanupOrphanedTags from "../cleanupOrphanedTags"

describe("CleanupOrphanedTags", () => {
  beforeEach(async () => {
    await syncDB()
  })

  it("deletes all tags with no associations", async () => {
    const user = await dataSource.manager.save(factoryUser())
    const recipe = await dataSource.manager.save(factoryRecipe({ user }))
    const tagsBefore = await Promise.all(
      [
        factoryTag({ name: "tone", recipes: [recipe] }),
        factoryTag({ name: "ttwo" }),
      ].map((r) => dataSource.manager.save(r)),
    )

    await cleanupOrphanedTags(dataSource)
    const tagsAfter = await dataSource.manager.find(Tag)

    expect(tagsBefore.length).to.equal(2)
    expect(tagsBefore.map((t) => t.name)).to.have.members(["tone", "ttwo"])
    expect(tagsAfter.length).to.equal(1)
    expect(tagsAfter.map((t) => t.name)).to.have.members(["tone"])
  })
})
