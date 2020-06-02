import { expect, syncDB, connection, factoryTag } from "../../../mochaSetup";
import { Tag } from "../tag";

describe("Tag Entity", () => {
  beforeEach(syncDB);
  afterEach(syncDB);

  it("entity and fields exist", async () => {
    const tag = await connection.manager.save(factoryTag());
    expect(Tag).to.exist;
    expect(tag.name).to.exist;
  });

  describe("Fields validate data", () => {
    it("name rejects duplicates", async () => {
      await connection.manager.save(factoryTag());
      return expect(connection.manager.save(factoryTag())).to.be.rejected;
    });
    it("name rejects empty strings", () => {
      const tag = factoryTag({ name: "" });
      return expect(connection.manager.save(tag)).to.be.rejected;
    });
    it("name rejects strings with non-alpha characters", () => {
      const tag = factoryTag({ name: "a2c" });
      return expect(connection.manager.save(tag)).to.be.rejected;
    });
    it("name rejects strings with non-lowercase characters", () => {
      const tag = factoryTag({ name: "aBc" });
      return expect(connection.manager.save(tag)).to.be.rejected;
    });
  });
});
