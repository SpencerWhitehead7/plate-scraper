'use strict'

const Sequelize = require(`sequelize`)
const database = require(`../database`)

const Recipe = database.define(`recipe`, {
  text : { // the actual recipe
    type : Sequelize.TEXT,
    allowNull : false,
  },
  sourceSite : { // the site it's from (null if a self-upload)
    type : Sequelize.STRING,
  },
  sourceUrl : { // the site it's from (null if it's a self upload)
    type : Sequelize.STRING,
  },
  createdBy : { // user who originally scraped / uplaoded it
    type : Sequelize.STRING,
    allowNull : false,
  },
  tags : { // for sorting
    type : Sequelize.ARRAY(Sequelize.TEXT),
    defaultValue : [],
  },
  forkedCount : { // number of people who've made their own copies (technically, times it's been copied)
    type : Sequelize.INTEGER,
    defaultValue : 0,
  },
})

module.exports = Recipe