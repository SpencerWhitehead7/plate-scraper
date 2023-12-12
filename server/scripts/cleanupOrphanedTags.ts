import { DataSource } from "typeorm"

import { getGlobalDataSource } from "../src/db/dataStore"

const cleanupOrpanedTags = async (dataSource: DataSource) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [, tagsCount] = await dataSource.manager.query(
    `
    DELETE FROM tag
    WHERE name IN 
      (
        SELECT tag.name FROM tag
        LEFT OUTER JOIN recipe_tags_tag ON tag.name = recipe_tags_tag."tagName"
        WHERE recipe_tags_tag."tagName" IS NULL
      )
    `,
  )
  console.log(`Removed ${tagsCount as number} tag(s)`)
}

if (module === require.main) {
  console.log("\nCleaning...\n")
  getGlobalDataSource()
    .then(cleanupOrpanedTags)
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
