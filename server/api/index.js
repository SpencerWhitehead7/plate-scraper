'use strict'

const router = require(`express`).Router()

// Trigger scripts

// /api/scrape
router.use(`/scrape`, require(`./scrape`))

// Get data

// /api/user
router.use(`/user`, require(`./user`))
// /api/recipe
router.use(`/recipe`, require(`./recipe`))

router.use((req, res, next) => {
  const error = new Error(`Not Found.`)
  error.status = 404
  next(error)
})

module.exports = router