'use strict'

const Sequelize = require(`sequelize`)

// make to make this separately with commandline createdb name
const projectsDBName = ``

const db = new Sequelize(process.env.DATABASE_URL || `postgres://localhost:5432/${projectsDBName}`, {
	logging : false,
})

module.exports = db