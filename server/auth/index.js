const router = require(`express`).Router()

const User = require(`../db/models/user`)

const isAlreadyAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    const err = new Error(`Already logged in to an account`)
    err.status = 409
    next(err)
  }else{
    next()
  }
}

const isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    next()
  }else{
    const err = new Error(`Not logged in`)
    err.status = 401
    next(err)
  }
}

// POST /auth/signup
router.post(`/signup`, isAlreadyAuthenticated, async (req, res, next) => {
  try{
    const user = await User.create(req.body)
    req.login(user, err => err ? next(err) : res.json(user))
  }catch(err){
    if(err.name === `SequelizeUniqueConstraintError`){
      err.status = 409
    }
    next(err)
  }
})

// POST /auth/login/
router.post(`/login`, isAlreadyAuthenticated, async (req, res, next) => {
  try{
    const user = await User.findOne({where : {email : req.body.email}})
    if(!user || !user.correctPassword(req.body.password)){
      const err = new Error(`Wrong username or password`)
      err.status = 401
      next(err)
    }else{
      req.login(user, err => err ? next(err) : res.json(user))
    }
  }catch(err){
    next(err)
  }
})

// POST /auth/logout
router.post(`/logout`, isAuthenticated, (req, res, next) => {
  req.logout()
  req.session.destroy(err => {
    delete req.session
    err ? next(err) : res.redirect(`/`)
  })
})

// GET /auth/me
router.get(`/me`, isAuthenticated, (req, res, next) => {
  res.json(req.user)
})

module.exports = router
