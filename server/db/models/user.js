'use strict'

const crypto = require(`crypto`)
const Sequelize = require(`sequelize`)
const database = require(`../database`)

const User = database.define(`user`, {
  email : {
    type : Sequelize.STRING,
    unique : true,
    allowNull : false,
  },
  password : {
    type : Sequelize.STRING,
    get(){
      return () => this.getDataValue(`password`)
    },
  },
  salt : {
    type : Sequelize.STRING,
    get(){
      return () => this.getDataValue(`salt`)
    },
  },
})

module.exports = User

// instance methods

User.prototype.correctPassword = function(candidatePw){
  return User.encryptedPassword(candidatePw, this.salt()) === this.password()
}

// class methods

User.generateSalt = function (){
  return crypto.randomBytes(16).toString(`base64`)
}

User.encryptPassword = function(plainText, salt){
  return crypto.createHash(`RSA-SHA256`)
    .update(plainText)
    .update(salt)
    .digest(`hex`)
}

// hooks

const setSaltandPassword = user => {
  if(user.changed(`password`)){
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt)
  }
}

User.beforeCreate(setSaltandPassword)
User.beforeUpdate(setSaltandPassword)