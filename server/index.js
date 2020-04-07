// NPM modules and built-ins
const express = require(`express`)
const session = require(`express-session`)
const SequelizeStore = require(`connect-session-sequelize`)(session.Store)
const passport = require(`passport`)
const path = require(`path`)

// Database
const db = require(`./db`)

// Sub-routers
const api = require(`./api`)
const auth = require(`./auth`)

// Passport serialization/deserialization instructions
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// Initialize app
const app = express()

// Logging middleware for development environment
if (process.env.NODE_ENV !== `production` &&
    process.env.NODE_ENV !== `test`) {
  /* eslint-disable global-require */
  app.use(require(`volleyball`))
  /* eslint-enable global-require */
}

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// db of sessions for connect-session-sequelize
const sessionStore = new SequelizeStore({ db })
sessionStore.sync() // sync so that session table will be created

// Sessions middleware
app.use(session({
  cookie: {
    maxAge: 604800, // a week
    secure: process.env.NODE_ENV === `production`,
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || `a perhaps worst-practices secret`,
  store: sessionStore,
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static file serving middleware
app.use(express.static(path.join(__dirname, `../public`)))

// Plug in sub-routers
// API requests
app.use(`/api`, api)
// Auth requests
app.use(`/auth`, auth)

// All other requests
app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/index.html`))
})

// 404 response
app.use((req, res, next) => {
  const err = new Error(`Page not found`)
  err.status = 404
  next(err)
})

// Error handling endware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== `test`) {
    console.error(err)
  }
  res.status(err.status || 500)
  res.send(err.message || `Internal server error`)
})

// Define port
const PORT = process.env.PORT || 1337

// Sync the DB and start up the server
if (process.env.NODE_ENV !== `test`) {
  db.sync(/* {force : true} */)
    .then(() => {
      console.log(`\nDatabase Synced\n`)
      app.listen(PORT, () => console.log(`Partying hard on http://localhost:${PORT}\n`))
    })
}

module.exports = app // for testing
