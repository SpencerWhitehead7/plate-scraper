import { Router } from "express"

import { notFoundRouteErr } from "../logic/errors"
import { authRouter } from "./auth"
import { recipeRouter } from "./recipe"
import { scrapeRouter } from "./scrape"
import { userRouter } from "./user"

export const apiRouter = Router()

// /api/auth
apiRouter.use("/auth", authRouter)

// /api/recipe
apiRouter.use("/recipe", recipeRouter)

// /api/scrape
apiRouter.use("/scrape", scrapeRouter)

// /api/user
apiRouter.use("/user", userRouter)

// error handling
apiRouter.use(() => {
  throw notFoundRouteErr
})
