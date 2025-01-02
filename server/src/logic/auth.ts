import { RequestHandler } from "express"

import { alreadyLoggedInErr, notLoggedInErr } from "./errors"

export type Session = {
  userId: number
  refreshTrigger: number
}

export const isAuthenticated =
  <P, ResB, ReqB, Q>(): RequestHandler<P, ResB, ReqB, Q> =>
  (req, _, next) => {
    if (isLoggedIn(req.session)) {
      // @ts-expect-error need it for downstream middleware/handlers
      req.userId = req.session.userId
    }

    !isLoggedIn(req.session) ? next(notLoggedInErr) : next()
  }

export const isNotAuthenticated =
  <P, ResB, ReqB, Q>(): RequestHandler<P, ResB, ReqB, Q> =>
  (req, _, next) => {
    isLoggedIn(req.session) ? next(alreadyLoggedInErr) : next()
  }

const isLoggedIn = (
  session: CookieSessionInterfaces.CookieSessionObject | null | undefined,
): session is Session =>
  Boolean(
    session &&
      session.userId !== undefined &&
      session.refreshTrigger !== undefined,
  )
