const router = require(`express`).Router()
const { User, Recipe, Tag } = require(`../db/models`)

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
