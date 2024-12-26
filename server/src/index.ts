import { initialize } from "./app"
import { getGlobalDataSource } from "./db/dataStore"
import { PORT } from "./env"

getGlobalDataSource()
  .then(initialize)
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Partying hard on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Not partying anywhere:", err)
  })
