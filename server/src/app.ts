import path from "node:path"

import compression from "compression"
import { TypeormStore } from "connect-typeorm"
import express, { NextFunction, Request, Response } from "express"
import expressSession from "express-session"
import helmet from "helmet"
import passport from "passport"
import { DataSource } from "typeorm"
import volleyball from "volleyball"

import { ENV, ENVS, SESSION_SECRET } from "./env"
import { Session } from "./logic/auth"

export const initialize = async (dataSource: DataSource) => {
  const { apiRouter } = await import("./api")
  const { userRepository } = await import("./db/repositories")
  const sessionRepository = dataSource.getRepository(Session)

  const app = express()

  // Body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Security
  app.use(helmet())

  // Compress responses
  app.use(compression())

  // Logging middleware for development environment
  if (ENV === ENVS.LOCAL) app.use(volleyball)

  app.use(
    expressSession({
      cookie: {
        maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week
        // secure cookies interfere with superagent and running on localhost - auth may be an issue in a real deployment too
        // TODO: still a problem with jwt?
        secure: ENV === ENVS.PROD,
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: false,
      secret: SESSION_SECRET,
      name: "sessionId",
      store: new TypeormStore({
        cleanupLimit: 0, // default
        limitSubquery: true, // default
        ttl: undefined, // defaults to session.maxAge according to connect-typeorm's docs (presumably actually session.cookie.maxAge; express-session's docs don't mention a session.maxAge property)
        onError: (typeormStore, err) => {
          console.error(err)
        },
      }).connect(sessionRepository),
    }),
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
  app.use(express.static(path.join(__dirname, "..", "..", "client")))
  app.use(express.static(path.join(__dirname, "..", "..", "public")))

  // Sub-routers
  app.use("/api", apiRouter)

  // All other requests
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"))
  })

  // Error handling endware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (ENV !== ENVS.TEST) console.error(err)

    res.status((err as { statusCode?: number }).statusCode ?? 500).json({
      error: err.name,
      message: err.message,
    })
  })

  return app
}
