import { RequestHandler } from "express";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const err = new Error(`Not logged in`);
    res.status(401);
    next(err);
  }
};

export const isNotAlreadyAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    const err = new Error(`Already logged in to an account`);
    res.status(409);
    next(err);
  } else {
    next();
  }
};
