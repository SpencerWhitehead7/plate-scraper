import { connection, expect, factoryTag, syncDB } from "../../../mochaSetup"
import { Tag } from "../tag"

describe("Tag Entity", () => {
  beforeEach(syncDB)
  afterEach(syncDB)

  it("entity and fields exist", async () => {
    const tag = await connection.manager.save(factoryTag())
    expect(Tag).to.exist
    expect(tag.name).to.exist
  })

  describe("Fields validate data", () => {
    it("name rejects duplicates", async () => {
      // using connection.manager.save returns the tag if it exists instead of
      // erroring if the insert fails, hence this manual insert function
      const insert = () =>
        connection.manager
          .createQueryBuilder()
          .insert()
          .into(Tag)
          .values(factoryTag())
          .execute()

      await insert()
      return expect(insert()).to.be.rejected
    })
    it("name rejects empty strings", () => {
      const tag = factoryTag({ name: "" })
      return expect(connection.manager.save(tag)).to.be.rejected
    })
    it("name rejects strings with non-alpha characters", () => {
      const tag = factoryTag({ name: "a2c" })
      return expect(connection.manager.save(tag)).to.be.rejected
    })
    it("name rejects strings with non-lowercase characters", () => {
      const tag = factoryTag({ name: "aBc" })
      return expect(connection.manager.save(tag)).to.be.rejected
    })
  })
})
