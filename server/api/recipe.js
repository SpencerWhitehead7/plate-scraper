const router = require(`express`).Router()
const {Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

const isOwner = async (req, res, next) => {
  try{
    const recipe = await Recipe.findByPk(req.params.id)
    if(recipe.userId === req.user.id){
      next()
    }else{
      const error = new Error(`Permission denied`)
      error.status = 401
      next(error)
    }
  }catch(error){
    console.log(error)
  }
}

// GET /api/recipe
router.get(`/`, async (req, res, next) => {
  try{
    const recipes = await Recipe.findAll()
    res.json(recipes)
  }catch(error){
    next(error)
  }
})

// POST /api/recipe
router.post(`/`, isAuthenticated, async (req, res, next) => {
  try{
    const recipeInfo = JSON.parse(JSON.stringify(req.body))
    recipeInfo.createdBy = req.user.id
    recipeInfo.userId = req.user.id
    delete recipeInfo.forkedCount
    const recipe = await Recipe.create(recipeInfo)
    res.json(recipe)
  }catch(error){
    next(error)
  }
})

// GET /api/recipe/:wildcard
router.get(`/:id`, async (req, res, next) => {
  try{
    const recipe = await Recipe.findByPk(req.params.id)
    res.json(recipe)
  }catch(error){
    next(error)
  }
})

// PUT /api/recipe/:wildcard
router.put(`/:id`, isAuthenticated, isOwner, async (req, res, next) => {
  try{
    const {text, title} = req.body
    const recipeInfo = {}
    if(text) recipeInfo.text = text
    if(title) recipeInfo.title = title
    const [, recipes] = await Recipe.update(recipeInfo, {
      where : {
        id : req.params.id,
        userId : req.user.id,
      },
      returning : true,
      plain : true,
    })
    res.json(recipes)
  }catch(error){
    next(error)
  }
})

// DELTE /api/recipe/:wildcard
router.delete(`/:id`, isAuthenticated, isOwner, async (req, res, next) => {
  try{
    await Recipe.destroy({
      where : {
        id : req.params.id,
        userId : req.user.id,
      },
    })
    res.end()
  }catch(error){
    next(error)
  }
})

module.exports = router
