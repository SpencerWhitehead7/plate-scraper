const router = require(`express`).Router()

const scrape = require(`../logic/`)

// POST /api/scrape/
router.post(`/`, async (req, res, next) => {
  try {
    const recipeData = await scrape(req.body.url)
    if (!recipeData.title) {
      const err = new Error(`Failed to scrape: invalid URL`)
      err.status = 406
      next(err)
    } else {
      res.json(recipeData)
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
