const router = require(`express`).Router()
const {Tag, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

const doesRecipeExist = async (req, res, next) => {
  try{
    const selector = req.params.recipeId ? req.params.recipeId : req.body.recipeId
    const recipe = await Recipe.findByPk(selector)
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

const cleanName = (req, res, next) => {
  req.body.name = req.body.name.toLowerCase().replace(/[^a-z]/gi, ``)
  next()
}

// POST /api/tag
router.post(`/`,
  isAuthenticated,
  doesRecipeExist,
  isOwner,
  cleanName,
  async (req, res, next) => {
    try{
      const [tag] = await Tag.findOrCreate({where : {name : req.body.name}})
      await req.body.recipe.addTag(tag)
      const recipe = await Recipe.findByPk(
        req.body.recipeId,
        {include : [Tag]}
      )
      res.json(recipe)
    }catch(error){
      next(error)
    }
  })

// DELETE /api/tag/:recipeId/:tagId
router.delete(`/:recipeId/:tagId`,
  isAuthenticated,
  doesRecipeExist,
  isOwner,
  async (req, res, next) => {
    try{
      let recipe = await Recipe.findByPk(req.params.recipeId)
      const tag = await Tag.findByPk(req.params.tagId)
      await recipe.removeTag(tag)
      recipe = await Recipe.findByPk(
        req.params.recipeId,
        {include : [Tag]}
      )
      res.json(recipe)
    }catch(error){
      console.log(error)
    }
  })

module.exports = router
