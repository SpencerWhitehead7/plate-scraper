const router = require(`express`).Router()
const {Tag, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

// POST /api/tag
router.post(`/`, isAuthenticated, async (req, res, next) => {
  try{
    const tag = await Tag.create({name : req.body.name})
    const recipe = await Recipe.findByPk(req.body.recipe)
    await recipe.addTag(tag)
    res.sendStatus(200)
  }catch(error){
    next(error)
  }
})

module.exports = router
