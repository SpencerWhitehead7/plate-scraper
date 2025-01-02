import path from "node:path"

import compression from "compression"
import cookieSession from "cookie-session"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import volleyball from "volleyball"

import { ENV, ENVS, SESSION_SECRET } from "./env"

export const initialize = async () => {
  const { apiRouter } = await import("./api")

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
    cookieSession({
      secret: SESSION_SECRET,
      maxAge: 1_000 * 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: ENV === ENVS.PROD, // breaks running FE locally via vite
      httpOnly: true,
    }),
  )

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
