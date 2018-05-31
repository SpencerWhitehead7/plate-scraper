'use strict'

const router = require(`express`).Router()

const scrape = require(`../logic/`)

router.post(`/`, (req, res, next) => {
	scrape(req.body.url)
		.then(recipe => res.json(recipe))
		.catch(error => next(error))
})

router.use((req, res, next) => {
	const error = new Error(`Not Found.`)
	error.status = 404
	next(error)
})

module.exports = router