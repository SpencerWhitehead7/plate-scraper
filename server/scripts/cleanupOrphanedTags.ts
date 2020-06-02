import { Connection, getConnection } from "typeorm";
import generateUtils from "../utils";

const cleanupOrpanedTags = async () => {
  let connection: Connection;
  if (process.env.NODE_ENV === "script") {
    // create your own connection if running independently
    ({ connection } = await generateUtils());
  } else {
    // use connection from main app/test otherwise
    connection = getConnection();
  }

  const [, tagsCount] = await connection.manager.query(
    `
    DELETE FROM tag
    WHERE name IN 
      (
        SELECT tag.name FROM tag
        LEFT OUTER JOIN recipe_tags_tag ON tag.name = recipe_tags_tag."tagName"
        WHERE recipe_tags_tag."tagName" IS NULL
      )
    `
  );

  console.log(
    `Removed ${tagsCount} tag${tagsCount > 1 || tagsCount === 0 ? `s` : ``}`
  );
};

if (module === require.main) {
  (async () => {
    try {
      console.log("\nCleaning...\n");
      await cleanupOrpanedTags();
      console.log("\nCleaning complete");
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  })();
}

export default cleanupOrpanedTags;
