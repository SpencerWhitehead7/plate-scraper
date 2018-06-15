'use strict'

const express = require(`express`)
const volleyball = require(`volleyball`)
const bodyParser = require(`body-parser`)
const session = require(`express-session`)
const passport = require(`passport`)
const path = require(`path`)

const { database } = require(`./db`)
const { User } = require(`./db`)

const SequelizeStore = require(`connect-session-sequelize`)(session.Store)
const sessionStore = new SequelizeStore({ database })
sessionStore.sync()

const app = express()

// Logging middleware
app.use(volleyball)

// Body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))

// Session middleware with passport
app.use(session({
  secret : process.env.SESSION_SECRET || `truly best security practices secret`,
  store : sessionStore,
  resave : false,
  saveUninitialized : false,
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser( async (id, done) => {
  try{
    const user = await User.findById(id)
    done(null, user)
  }catch(error){
    done(error)
  }
})

// Static middleware
app.use(express.static(path.join(__dirname, `../public`)))

// Auth requests
app.use(`/auth`, require(`./auth`))

// API requests
app.use(`/api`, require(`./api`))

// All other requests
app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, `../public`))
})

// Error handling
app.use((error, req, res, next) => {
  console.error(error)
  console.error(error.stack)
  res.status(error.status || 500).send(error.message || `Internal Server Error`)
})

// Define port
const PORT = process.env.PORT || 1337

// Sync the database and start up the server
database.sync(/* {force : true} */)
  .then(() => {
    console.log(`\nDatabase Synced\n`)
    app.listen(PORT, () => console.log(`Partying hard on http://localhost:${PORT}\n`))
  })