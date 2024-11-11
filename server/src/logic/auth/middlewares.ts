import { RequestHandler } from "express"

import { alreadyLoggedInErr, notLoggedInErr } from "../errors"

export const isAuthenticated =
  <P, ResB, ReqB, Q>(): RequestHandler<P, ResB, ReqB, Q> =>
  (req, __, next) => {
    req.isAuthenticated() ? next() : next(notLoggedInErr)
  }

export const isNotAuthenticated =
  <P, ResB, ReqB, Q>(): RequestHandler<P, ResB, ReqB, Q> =>
  (req, __, next) => {
    req.isAuthenticated() ? next(alreadyLoggedInErr) : next()
  }
