const Sequelize = require(`sequelize`)
const database = require(`../database`)

const Tag = database.define(`tag`, {
  name : {
    type : Sequelize.STRING,
    allowNull : false,
    unique : true,
    validate : {
      notEmpty : true,
      isAlpha : true,
      isLowercase : true,
    },
  },
})

const normalize = tag => {
  if(tag.changed(`name`) && typeof tag.name === `string`){
    tag.name = tag.name.toLowerCase().replace(/[^a-z]/gi, ``)
  }
}

Tag.beforeValidate(normalize)

module.exports = Tag
