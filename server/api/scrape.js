const router = require(`express`).Router()

const scrape = require(`../logic/`)

// POST /api/scrape/
router.post(`/`, async (req, res, next) => {
  try {
    const recipeData = await scrape(req.body.url)
    // doesn't cover all failure states or the parser just being wrong
    // but no data or a missing title/recipe is a sure sign something went wrong
    if (!recipeData || (recipeData && (!recipeData.title || !recipeData.recipe))) {
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
