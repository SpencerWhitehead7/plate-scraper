const router = require(`express`).Router()

const scrape = require(`./scrape`)
const user = require(`./user`)
const recipe = require(`./recipe`)

// /api/scrape
router.use(`/scrape`, scrape)

// /api/user
router.use(`/user`, user)

// /api/recipe
router.use(`/recipe`, recipe)

// error handling
router.use((req, res, next) => {
  const error = new Error(`Not Found.`)
  error.status = 404
  next(error)
})

module.exports = router
