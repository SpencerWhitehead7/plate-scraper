import { dataSource, expect, factoryTag, syncDB } from "../../../../mochaSetup"
import { Tag } from "../tag"

describe("Tag Entity", () => {
  beforeEach(syncDB)

  afterEach(syncDB)

  it("entity and fields exist", async () => {
    const tag = await dataSource.manager.save(factoryTag())
    expect(Tag).to.exist
    expect(tag.name).to.exist
  })

  describe("Fields validate data", () => {
    it("name rejects duplicates", async () => {
      // using connection.manager.save returns the tag if it exists instead of
      // erroring if the insert fails, hence this manual insert function
      const insert = () =>
        dataSource.manager
          .createQueryBuilder()
          .insert()
          .into(Tag)
          .values(factoryTag())
          .execute()

      await insert()
      await expect(insert()).to.be.rejected
    })
    it("name rejects empty strings", async () => {
      const t = factoryTag({ name: "" })
      await expect(dataSource.manager.save(t)).to.be.rejected
    })
    it("name rejects strings with non-alpha characters", async () => {
      const t = factoryTag({ name: "a2c" })
      await expect(dataSource.manager.save(t)).to.be.rejected
    })
    it("name rejects strings with non-lowercase characters", async () => {
      const t = factoryTag({ name: "aBc" })
      await expect(dataSource.manager.save(t)).to.be.rejected
    })
  })
})
