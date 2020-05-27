import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const err = new Error(`Not logged in`);
    res.status(401);
    next(err);
  }
};

export const isNotAlreadyAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    const err = new Error(`Already logged in to an account`);
    res.status(409);
    next(err);
  } else {
    next();
  }
};
