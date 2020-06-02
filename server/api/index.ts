import { Router } from "express";

import authRouter from "./auth";
import recipeRouter from "./recipe";
import scrapeRouter from "./scrape";
import userRouter from "./user";

const apiRouter = Router();

// /api/auth
apiRouter.use(`/auth`, authRouter);

// /api/recipe
apiRouter.use(`/recipe`, recipeRouter);

// /api/scrape
apiRouter.use(`/scrape`, scrapeRouter);

// /api/user
apiRouter.use(`/user`, userRouter);

// error handling
apiRouter.use((_, res, next) => {
  res.status(404);
  next(new Error(`Route not found`));
});

module.exports = apiRouter;
