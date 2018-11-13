const router = require(`express`).Router()
const {User, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

const isOwner = (req, res, next) => {
  if(Number(req.params.id) === req.user.id){
    next()
  }else{
    const error = new Error(`Permission denied`)
    error.status = 401
    next(error)
  }
}

// GET /api/user/:wildcard
router.get(`/:id`, async (req, res, next) => {
  try{
    const user = await User.findByPk(req.params.id, {include : [Recipe]})
    res.json(user)
  }catch(error){
    next(error)
  }
})

// PUT /api/user/:wildcard
router.put(`/:id`, isAuthenticated, isOwner, async (req, res, next) => {
  try{
    const userInfo = JSON.parse(JSON.stringify(req.body))
    delete userInfo.salt
    const [, user] = await User.update(userInfo, {
      where : {id : req.params.id},
      returning : true,
      plain : true,
    })
    res.json(user)
  }catch(error){
    next(error)
  }
})

// DELETE /api/user/:wildcard
router.delete(`/:id`, isAuthenticated, isOwner, async (req, res, next) => {
  try{
    await User.destroy({
      where : {
        id : req.params.id,
      },
    })
    res.end()
  }catch(error){
    next(error)
  }
})

module.exports = router
