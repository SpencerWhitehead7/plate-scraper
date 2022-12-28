import { Connection, getConnection } from "typeorm"

import { generateUtils } from "../utils"

const cleanupOrpanedTags = async () => {
  let connection: Connection
  if (process.env.NODE_ENV === "script") {
    // create your own connection if running independently
    ;({ connection } = await generateUtils())
  } else {
    // use connection from main app/test otherwise
    connection = getConnection()
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
  )

  console.log(`Removed ${tagsCount as number} tag(s)`)
}

if (module === require.main) {
  console.log("\nCleaning...\n")
  cleanupOrpanedTags()
    .then(() => {
      console.log("\nCleaning completed")
      process.exit(0)
    })
    .catch((err) => {
      console.log("\nCleaning errored")
      console.error(err)
      process.exit(1)
    })
}

export default cleanupOrpanedTags
