'use strict'

const router = require(`express`).Router()

const scrape = require(`../logic/`)

// POST /api/scrape/
router.post(`/`, (req, res, next) => {
  scrape(req.body.url)
    .then(recipe => res.json(recipe))
    .catch(error => next(error))
})

module.exports = router