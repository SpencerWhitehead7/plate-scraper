const router = require(`express`).Router()
const {User} = require(`../db`)

// GET /api/user/:wildcard
router.get(`/:id`, async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id)
    res.json(user)
  }catch(error){
    next(error)
  }
})

// PUT /api/user/:wildcard
router.put(`/:id`, async (req, res, next) => {
  try{
    const [, user] = await User.update(req.body, {
      where : {id : req.params.id},
      returning : true,
      plain : true,
    })
    res.json(user)
  }catch(error){
    next(error)
  }
})

// DELTE /api/user/:wildcard
router.delete(`/:id`, async (req, res, next) => {
  try{
    await User.destory({
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
