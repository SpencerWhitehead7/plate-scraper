const User = require(`./user`)
const Recipe = require(`./recipe`)
const Tag = require(`./tag`)

// Associations
// One-Many relation between Users and Recipes
Recipe.belongsTo(User)
User.hasMany(Recipe)

// Many-Many relation between Recipes and Tags
Tag.belongsToMany(Recipe, {through : `recipeTraits`})
Recipe.belongsToMany(Tag, {through : `recipeTraits`})

module.exports = {
  User,
  Recipe,
  Tag,
}
