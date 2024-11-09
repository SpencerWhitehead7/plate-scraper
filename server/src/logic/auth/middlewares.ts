import { RequestHandler } from "express"

import { alreadyLoggedInErr, notLoggedInErr } from "../errors"

export const isAuthenticated: RequestHandler = (req, __, next) => {
  req.isAuthenticated() ? next() : next(notLoggedInErr)
}

export const isNotAuthenticated: RequestHandler = (req, __, next) => {
  req.isAuthenticated() ? next(alreadyLoggedInErr) : next()
}
