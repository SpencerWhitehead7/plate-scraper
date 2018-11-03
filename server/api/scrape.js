const router = require(`express`).Router()

const scrape = require(`../logic/`)

// POST /api/scrape/
router.post(`/`, async (req, res, next) => {
  try{
    const recipeData = await scrape(req.body.url)
    res.json(recipeData)
  }catch(error){
    next(error)
  }
})

module.exports = router
