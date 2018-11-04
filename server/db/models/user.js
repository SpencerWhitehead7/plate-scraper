const Sequelize = require(`sequelize`)
const crypto = require(`crypto`)

const db = require(`../database`)

const User = db.define(`user`, {
  email : {
    type : Sequelize.STRING,
    unique : true,
    allowNull : false,
    validate : {
      isEmail : true,
    },
  },
  password : {
    type : Sequelize.STRING,
    allowNull : false,
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

// Instance methods
User.prototype.correctPassword = function(passwordAttempt){
  return User.encryptPassword(passwordAttempt, this.salt()) === this.password()
}

// Class methods
User.generateSalt = function(){
  return crypto.randomBytes(16).toString(`base64`)
}

User.encryptPassword = function(newPasswordPlainText, salt){
  return crypto
    .createHash(`RSA-SHA256`)
    .update(newPasswordPlainText)
    .update(salt)
    .digest(`hex`)
}

const setSaltAndPassword = user => {
  if(user.changed(`password`)){
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

// Hooks
User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

module.exports = User
