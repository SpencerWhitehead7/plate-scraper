const Sequelize = require(`sequelize`)
const database = require(`../database`)

const Recipe = database.define(`recipe`, {
  text: { // the actual recipe
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  title: { // the recipe's title
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  sourceSite: { // the site it's from with default for uploads
    type: Sequelize.STRING,
    defaultValue: `User Upload`,
    validate: {
      notEmpty: true,
    },
  },
  sourceUrl: { // the exact page it's from with default for uploads
    type: Sequelize.STRING,
    defaultValue: `User Upload`,
    validate: {
      notEmpty: true,
    },
  },
  createdBy: { // user who originally scraped / uploaded it
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  forkedCount: { // times it's been copied by others
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})

module.exports = Recipe
