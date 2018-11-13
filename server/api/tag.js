const router = require(`express`).Router()
const {Tag, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

const doesRecipeExist = async (req, res, next) => {
  try{
    const recipe = await Recipe.findByPk(req.body.recipe)
    if(recipe){
      req.body.recipe = recipe
      next()
    }else{
      next(new Error(`No such recipe`))
    }
  }catch(error){
    next(error)
  }
}

const isOwner = (req, res, next) => {
  if(req.body.recipe.userId === req.user.id){
    next()
  }else{
    const error = new Error(`Permission denied`)
    error.status = 401
    next(error)
  }
}

// POST /api/tag
router.post(`/`,
  isAuthenticated,
  doesRecipeExist,
  isOwner,
  async (req, res, next) => {
    try{
      const tag = await Tag.create({name : req.body.name})
      await req.body.recipe.addTag(tag)
      res.sendStatus(200)
    }catch(error){
      next(error)
    }
  })

module.exports = router
