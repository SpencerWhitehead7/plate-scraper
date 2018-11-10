const Sequelize = require(`sequelize`)
const database = require(`../database`)

const Recipe = database.define(`recipe`, {
  text : { // the actual recipe
    type : Sequelize.TEXT,
    allowNull : false,
    validate : {
      notEmpty : true,
    },
  },
  title : { // the recipe's title
    type : Sequelize.TEXT,
    allowNull : false,
    validate : {
      notEmpty : true,
    },
  },
  sourceSite : { // the site it's from (null if a self-upload)
    type : Sequelize.STRING,
    defaultValue : `User Upload`,
    validate : {
      notEmpty : true,
    },
  },
  sourceUrl : { // the exact page it's from (null if it's a self upload)
    type : Sequelize.STRING,
    defaultValue : `User Upload`,
    validate : {
      notEmpty : true,
    },
  },
  createdBy : { // user who originally scraped / uploaded it
    type : Sequelize.INTEGER,
    allowNull : false,
    validate : {
      notEmpty : true,
    },
  },
  forkedCount : { // number of people who've made their own copies (technically, times it's been copied)
    type : Sequelize.INTEGER,
    defaultValue : 0,
  },
})

module.exports = Recipe
