'use strict'

const User = require(`./user`)
const Recipe = require(`./recipe`)

// Associations
Recipe.belongsTo(User)
User.hasMany(Recipe)

module.exports = {
  User,
  Recipe,
}