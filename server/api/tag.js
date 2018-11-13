const router = require(`express`).Router()
const {Tag, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

const doesRecipeExist = async (req, res, next) => {
  try{
    const recipe = await Recipe.findByPk(req.body.recipeId)
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

const doesTagExist = async (req, res, next) => {
  try{
    let tag = await Tag.findOne({where : {name : req.body.name}})
    if(!tag){
      tag = await Tag.create({name : req.body.name})
    }
    req.body.tag = tag
    next()
  }catch(error){
    console.log(error)
  }
}

// POST /api/tag
router.post(`/`,
  isAuthenticated,
  doesRecipeExist,
  isOwner,
  cleanName,
  doesTagExist,
  async (req, res, next) => {
    try{
      await req.body.recipe.addTag(req.body.tag)
      const recipe = await Recipe.findByPk(
        req.body.recipeId,
        {include : [Tag]}
      )
      res.json(recipe)
    }catch(error){
      next(error)
    }
  })

router.delete(`/:recipeId/:tagId`,
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
