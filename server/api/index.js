const router = require(`express`).Router()

const scrape = require(`./scrape`)
const user = require(`./user`)
const recipe = require(`./recipe`)
const tag = require(`./tag`)

// /api/scrape
router.use(`/scrape`, scrape)

// /api/user
router.use(`/user`, user)

// /api/recipe
router.use(`/recipe`, recipe)

// /api/recipe
router.use(`/tag`, tag)

// error handling
router.use((req, res, next) => {
  const error = new Error(`Route not found`)
  error.status = 404
  next(error)
})

module.exports = router
