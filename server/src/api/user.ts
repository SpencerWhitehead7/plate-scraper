import { Router } from "express"

import { userIdGetSchema } from "../@types/apiContract"
import { userRepository } from "../db/repositories"
import { notFoundUserErr } from "../logic/errors"
import { validate } from "../logic/serialization"

export const userRouter = Router()

// GET /api/user
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await userRepository.getAll()

    res.json(users)
  } catch (err) {
    next(err)
  }
})

// GET /api/user/:id
userRouter.get("/:id", validate(userIdGetSchema), async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userRepository.getByIdWithRecipes(userId)
    if (!user) throw notFoundUserErr

    res.json(user)
  } catch (err) {
    next(err)
  }
})
