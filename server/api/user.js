const router = require(`express`).Router()
const { User, Recipe, Tag } = require(`../db/models`)

const { isAuthenticated } = require(`../authenticationLogic`)

// PUT /api/user
router.put(
  `/`,
  isAuthenticated,
  async (req, res, next) => {
    try {
      const newInfo = JSON.parse(JSON.stringify(req.body.newInfo))
      const user = await User.findByPk(req.user.id)
      if (req.body.password && user.correctPassword(req.body.password)) {
        delete newInfo.salt
        delete newInfo.id
        const [, updatedUser] = await User.update(newInfo, {
          where: { id: req.user.id },
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

// DELETE /api/user
router.delete(
  `/`,
  isAuthenticated,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id)
      await user.destroy()
      req.logout()
      req.session.destroy(err => (err ? next(err) : res.sendStatus(200)))
    } catch (error) {
      next(error)
    }
  },
)

// GET /api/user/:id
router.get(`/:id`, async (req, res, next) => {
  try {
    const user = await User.findByPk(
      req.params.id,
      {
        include: [
          {
            model: Recipe,
            include: [Tag],
          },
        ],
      },
    )
    res.json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = router
