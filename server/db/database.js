'use strict'

const Sequelize = require(`sequelize`)
const pkg = require(`../../package.json`)

const databaseName = pkg.name + (process.env.NODE_ENV === `test` ? `-test` : ``)

const database = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`, {
    logging : false,
  }
)

module.exports = database