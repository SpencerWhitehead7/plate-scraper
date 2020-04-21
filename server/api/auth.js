const router = require(`express`).Router()

const User = require(`../db/models/user`)

const { isAuthenticated, isAlreadyAuthenticated } = require(`../authenticationLogic`)

// GET /api/auth
router.get(`/`, (req, res, next) => {
  res.json(req.user)
})

// PUT /api/auth
router.put(
  `/`,
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { user, body } = req
      // keep someone from modifying a field they shouldn't via curl or whatever
      const { newEmail, newUserName, newPassword, password } = body
      if (user.correctPassword(password)) {
        const updatedUser = await user.update({
          email: newEmail,
          userName: newUserName,
          password: newPassword,
        }, {
          where: { id: user.id },
          returning: true,
          plain: true,
        })
        res.json(updatedUser)
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      next(error)
    }
  },
)

// POST /api/auth/signup
router.post(
  `/signup`,
  isAlreadyAuthenticated,
  async (req, res, next) => {
    try {
      const user = await User.create(req.body)
      req.login(user, err => (err ? next(err) : res.json(user)))
    } catch (err) {
      if (err.name === `SequelizeUniqueConstraintError`) {
        err.status = 409
      }
      next(err)
    }
  },
)

// POST /api/auth/login/
router.post(
  `/login`,
  isAlreadyAuthenticated,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (!user || !user.correctPassword(req.body.password)) {
        const err = new Error(`Wrong username or password`)
        err.status = 401
        next(err)
      } else {
        req.login(user, err => (err ? next(err) : res.json(user)))
      }
    } catch (err) {
      next(err)
    }
  },
)

// POST /api/auth/logout
router.post(
  `/logout`,
  isAuthenticated,
  (req, res, next) => {
    req.logout()
    req.session.destroy(err => (err ? next(err) : res.sendStatus(204)))
  },
)

module.exports = router

// POST /api/auth/destroy
router.post(
  `/destroy`,
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { user, body } = req
      const { password } = body
      if (user.correctPassword(password)) {
        await user.destroy()
        req.logout()
        req.session.destroy(err => (err ? next(err) : res.sendStatus(200)))
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      next(error)
    }
  },
)
