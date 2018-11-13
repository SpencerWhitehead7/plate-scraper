const router = require(`express`).Router()
const {Tag, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

const doesRecipeExist = async (req, res, next) => {
  try{
    const recipe = await Recipe.findByPk(req.body.recipe)
    if(recipe){
      req.recipe = recipe
      next()
    }else{
      next(new Error(`No such recipe`))
    }
  }catch(error){
    next(error)
  }
}

// POST /api/tag
router.post(`/`,
  isAuthenticated,
  doesRecipeExist,
  async (req, res, next) => {
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
