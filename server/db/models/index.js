const User = require(`./user`)
const Recipe = require(`./recipe`)
const Tag = require(`./tag`)

// Associations
Recipe.belongsTo(User)
User.hasMany(Recipe)

module.exports = {
  User,
  Recipe,
  Tag,
}
