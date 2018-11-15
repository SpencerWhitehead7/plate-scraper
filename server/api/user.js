const router = require(`express`).Router()
const {User, Recipe} = require(`../db/models`)

const {isAuthenticated} = require(`../authenticationLogic`)

// PUT /api/user
router.put(`/`,
  isAuthenticated,
  async (req, res, next) => {
    try{
      const userInfo = JSON.parse(JSON.stringify(req.body))
      delete userInfo.salt
      const [, user] = await User.update(userInfo, {
        where : {id : req.user.id},
        returning : true,
        plain : true,
      })
      res.json(user)
    }catch(error){
      next(error)
    }
  })

// DELETE /api/user
router.delete(`/`,
  isAuthenticated,
  async (req, res, next) => {
    try{
      const user = await User.findByPk(req.user.id)
      await user.destroy()
      req.logout()
      req.session.destroy(err => err ? next(err) : res.redirect(`/`))
    }catch(error){
      next(error)
    }
  })

// GET /api/user/:id
router.get(`/:id`, async (req, res, next) => {
  try{
    const user = await User.findByPk(req.params.id, {include : [Recipe]})
    res.json(user)
  }catch(error){
    next(error)
  }
})

module.exports = router
