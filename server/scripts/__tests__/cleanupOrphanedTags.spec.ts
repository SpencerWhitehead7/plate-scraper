import {
  expect,
  syncDB,
  connection,
  factoryUser,
  factoryRecipe,
  factoryTag,
} from "../../mochaSetup";
import { Tag } from "../../db/entities";

import cleanupOrphanedTags from "../cleanupOrphanedTags";

describe("CleanupOrphanedTags", () => {
  beforeEach(async () => {
    await syncDB();
    const user = await connection.manager.save(factoryUser());
    const recipe = await connection.manager.save(factoryRecipe({ user }));
    await Promise.all(
      [
        factoryTag({ name: "tone", recipes: [recipe] }),
        factoryTag({ name: "ttwo" }),
      ].map((row) => connection.manager.save(row))
    );
  });
  afterEach(syncDB);

  it("deletes all tags with no associations", async () => {
    const before = await connection.manager.find(Tag);
    await cleanupOrphanedTags();
    const after = await connection.manager.find(Tag);

    expect(before.length).to.equal(2);
    expect(after.length).to.equal(1);
  });
});
