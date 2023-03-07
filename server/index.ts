import path from "node:path"

import compression from "compression"
import { TypeormStore } from "connect-typeorm"
import express, { NextFunction, Request, Response } from "express"
import expressSession from "express-session"
import helmet from "helmet"
import passport from "passport"
import { DataSource } from "typeorm"
import volleyball from "volleyball"

import { getGlobalDataSource } from "./db/dataStore"
import { Session } from "./logic/auth"

const SECRET = process.env.SESSION_SECRET || "a perhaps worst-practices secret"
const PORT = process.env.PORT || 1337
const ENV = process.env.NODE_ENV
const IS_PROD = ENV === "prod"
const IS_SCRIPT = ENV === "script"
const IS_TEST = ENV === "test"
const IS_DEV = !IS_PROD && !IS_SCRIPT && !IS_TEST

export const boot = async (dataSource: DataSource) => {
  const { apiRouter } = await import("./api")
  const { userRepository } = await import("./db/repositories")
  const sessionRepository = dataSource.getRepository(Session)

  const app = express()

  // Body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Security
  // its csp interferes with webpack-dev-server, which we need in dev mode
  // don't ask how I know, but lets just say it cost ~12 hours of my life
  if (IS_PROD) app.use(helmet())

  // Compress responses
  app.use(compression())

  // Logging middleware for development environment
  if (IS_DEV) app.use(volleyball) // some other logger for prod

  app.use(
    expressSession({
      cookie: {
        maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week
        secure: IS_PROD, // secure cookies interfere with superagent and running on localhost - auth may be an issue in a real deployment too
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: false,
      secret: SECRET,
      name: "sessionId",
      store: new TypeormStore({
        cleanupLimit: 0, // default
        limitSubquery: true, // default
        ttl: undefined, // defaults to session.maxAge according to connect-typeorm's docs (presumably actually session.cookie.maxAge; express-session's docs don't mention a session.maxAge property)
        onError: (typeormStore, err) => {
          console.error(err)
        },
      }).connect(sessionRepository),
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await userRepository.getReqUser(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
  app.use(passport.initialize())
  app.use(passport.session())

  // Static file serving middleware
  app.use(express.static(path.join(__dirname, "..", "client")))
  app.use(express.static(path.join(__dirname, "..", "..", "public")))

  // Sub-routers
  app.use("/api", apiRouter)

  // All other requests
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"))
  })

  // Error handling endware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!IS_TEST) console.error(err)

    res.status((err as { statusCode?: number }).statusCode ?? 500).json({
      error: err.name ?? "InternalServerErr",
      message: err.message,
    })
  })

  const server = app.listen(PORT, () => {
    console.log(`Partying hard on http://localhost:${PORT}`)
  })
  return { app, server } // for testing
}

if (IS_PROD || IS_DEV) {
  getGlobalDataSource()
    .then(boot)
    .catch((err) => {
      console.error("Not partying on any ports:", err)
    })
}
