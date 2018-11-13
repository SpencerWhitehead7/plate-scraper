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
  doesTagExist,
  async (req, res, next) => {
    try{
      await req.body.recipe.addTag(req.body.tag)
      res.sendStatus(200)
    }catch(error){
      next(error)
    }
  })

module.exports = router
