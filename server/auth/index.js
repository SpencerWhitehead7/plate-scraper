const router = require(`express`).Router()

const User = require(`../db/models/user`)

// POST /auth/signup
router.post(`/signup`, async (req, res, next) => {
  try{
    const user = await User.create(req.body)
    req.login(user, err => err ? next(err) : res.json(user))
  }catch(err){
    if(err.name === `SequelizeUniqueConstraintError`){
      err.status = 401
    }
    next(err)
  }
})

// POST /auth/login/
router.post(`/login`, async (req, res, next) => {
  const usernameOrPasswordFailure = () => {
    const err = new Error(`Wrong username or password`)
    err.status = 401
    next(err)
  }

  try{
    const user = await User.findOne({where : {email : req.body.email}})
    if(!user){
      console.log(`User not found: ${req.body.email}`)
      usernameOrPasswordFailure()
    }else if(!user.correctPassword(req.body.password)){
      console.log(`Incorrect password for user: ${req.body.email}`)
      usernameOrPasswordFailure()
    }else{
      req.login(user, err => err ? next(err) : res.json(user))
    }
  }catch(err){
    next(err)
  }
})

// POST /auth/logout
router.post(`/logout`, (req, res) => {
  req.logout()
  req.session.destory()
  res.redirect(`/`)
})

// GET /auth/me
router.get(`/me`, (req, res) => {
  res.json(req.user)
})

module.exports = router
