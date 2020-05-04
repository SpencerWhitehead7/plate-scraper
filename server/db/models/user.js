const Sequelize = require(`sequelize`)
const crypto = require(`crypto`)

const db = require(`../`)
const Recipe = require(`./recipe`)

const User = db.define(`user`, {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      return () => this.getDataValue(`password`)
    },
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue(`salt`)
    },
  },
  userName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isAlphanumeric: true,
      len: [5, 20],
    },
  },
})

// Instance methods
User.prototype.correctPassword = function(passwordAttempt) {
  return User.encryptPassword(passwordAttempt, this.salt()) === this.password()
}

// Class methods
User.generateSalt = function() {
  return crypto.randomBytes(16).toString(`base64`)
}

User.encryptPassword = function(newPasswordPlainText, salt) {
  return crypto
    .createHash(`RSA-SHA256`)
    .update(newPasswordPlainText)
    .update(salt)
    .digest(`hex`)
}

// Hooks
const setSaltAndPassword = user => {
  if (user.changed(`password`)) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

const transferCreatedBy = async user => {
  try {
    await Recipe.update({
      createdBy: 1,
    }, {
      where: { createdBy: user.id },
      returning: true,
      plain: true,
    })
  } catch (error) {
    console.log(error)
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

User.beforeDestroy(transferCreatedBy)

module.exports = User
