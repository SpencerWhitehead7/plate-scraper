import { RequestHandler } from "express";

import { alreadyLoggedInErr, notLoggedInErr } from '../errors'

export const isAuthenticated: RequestHandler = (req, __, next) => {
  req.isAuthenticated() ? next() : next(notLoggedInErr);
};

export const isNotAlreadyAuthenticated: RequestHandler = (req, __, next) => {
  !req.isAuthenticated() ? next() : next(alreadyLoggedInErr);
};
