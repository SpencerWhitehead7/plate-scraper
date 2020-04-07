const Sequelize = require(`sequelize`)
const database = require(`../database`)

const Tag = database.define(`tag`, {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isAlpha: true,
      isLowercase: true,
    },
  },
})

module.exports = Tag
