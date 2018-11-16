const router = require(`express`).Router()
const {Recipe, Tag, User} = require(`../db/models`)

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
    const recipes = await Recipe.findAll({include : [Tag]})
    res.json(recipes)
  }catch(error){
    next(error)
  }
})

// POST /api/recipe
router.post(`/`,
  isAuthenticated,
  async (req, res, next) => {
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

// GET /api/recipe/byid/:id
router.get(`/byid/:id`, async (req, res, next) => {
  try{
    const recipe = await Recipe.findByPk(
      req.params.id,
      {include : [Tag]}
    )
    res.json(recipe)
  }catch(error){
    next(error)
  }
})

// GET /api/recipe/bytag
router.get(`/bytag`, async (req, res, next) => {
  try{
    const tagNames = []
    Object.keys(req.query).forEach(key => {
      tagNames.push(req.query[key].toLowerCase().replace(/[^a-z]/gi, ``))
    })
    const tagPromises = []
    tagNames.forEach(tag => {
      tagPromises.push(Tag.findOne({
        where : {name : tag},
        include : [Recipe],
      }))
    })
    const tags = await Promise.all(tagPromises)
    const recipes = {}
    tags.forEach(tag => {
      if(tag){
        tag.dataValues.recipes.forEach(recipe => {
          recipes[recipe.id] = recipe
        })
      }
    })
    res.json(Object.values(recipes))
  }catch(error){
    console.log(error)
  }
})

// Post /api/recipe/fork/:id
router.post(`/fork/:id`,
  isAuthenticated,
  async (req, res, next) => {
    try{
      const recipe = await Recipe.findByPk(req.params.id)
      const user = await User.findByPk(req.user.id)
      if(recipe){
        const data = JSON.parse(JSON.stringify(recipe.dataValues))
        delete data.id
        delete data.userId
        data.forkedCount = 0
        const forked = await Recipe.create(data)
        await user.addRecipe(forked)
        if(recipe.userId !== req.user.id){
          const newForkedCount = recipe.forkedCount + 1
          await recipe.update({forkedCount : newForkedCount})
        }
        res.json(user)
      }else{
        const error = new Error(`Recipe not found`)
        error.status = 404
        next(error)
      }
    }catch(error){
      next(error)
    }
  })

// PUT /api/recipe/:id
router.put(`/:id`,
  isAuthenticated,
  isOwner,
  async (req, res, next) => {
    try{
      const {text, title} = req.body
      const recipeInfo = {}
      if(text) recipeInfo.text = text
      if(title) recipeInfo.title = title
      const [, recipes] = await Recipe.update(
        recipeInfo,
        {
          where : {id : req.params.id},
          returning : true,
          plain : true,
        }
      )
      res.json(recipes)
    }catch(error){
      next(error)
    }
  })

// DELETE /api/recipe/:id
router.delete(`/:id`,
  isAuthenticated,
  isOwner,
  async (req, res, next) => {
    try{
      await Recipe.destroy({where : {id : req.params.id}})
      res.end()
    }catch(error){
      next(error)
    }
  })

module.exports = router
