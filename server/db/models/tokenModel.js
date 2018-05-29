const Sequelize = require(`sequelize`)
const db = require(`../database`)

module.exports = db.define(`tokenModel`, {
	name : {
		type : Sequelize.STRING,
	},
})