const router = require(`express`).Router()

const auth = require(`./auth`)
const recipe = require(`./recipe`)
const scrape = require(`./scrape`)
const tag = require(`./tag`)
const user = require(`./user`)

// /api/auth
router.use(`/auth`, auth)

// /api/recipe
router.use(`/recipe`, recipe)

// /api/scrape
router.use(`/scrape`, scrape)

// /api/tag
router.use(`/tag`, tag)

// /api/user
router.use(`/user`, user)

// error handling
router.use((req, res, next) => {
  const error = new Error(`Route not found`)
  error.status = 404
  next(error)
})

module.exports = router
