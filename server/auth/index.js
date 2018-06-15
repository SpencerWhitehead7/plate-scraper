const router = require(`express`).Router()
const User = require(`../db`)

router.get(`/me`, (req, res, next) => {
  res.json(req.user)
})

router.post(`/signup`, async (req, res, next) => {
  try{
    const user = await User.create(req.body)
    req.login(user, error => (error ? next(error) : res.json(user)))
  }catch(error){
    next(error)
  }
})

router.post(`/login`, async (req, res, next) => {
  try{
    const user = await User.findOne({ where : { email : req.body.email } })
    if(!user){
      console.log(`No such user found:`, req.body.email)
      res.status(401).send(`Wrong username and/or password`)
    }else if(!user.correctPassword(req.body.password)){
      console.log(`Incorrect password for user:`, req.body.email)
      res.status(401).send(`Wrong username and/or password`)
    }else{
      req.login(user, error => (error ? next(error) : res.json(user)))
    }
  }catch(error){
    next(error)
  }
})

router.delete(`/logout`, (req, res, next) => {
  req.logout()
  req.session.destroy()
  res.sendStatus(204)
})