import { Router } from "express"

import { userRepository } from "../db/repositories"
import { notFoundUserErr } from "../logic/errors"
import { serializers } from "../logic/errors"

export const userRouter = Router()

// GET /api/user/:id
userRouter.get("/:id", ...serializers.user.id.get, async (req, res, next) => {
  try {
    const user = await userRepository.getByIdWithRecipes(Number(req.params.id))
    if (!user) throw notFoundUserErr

    res.json(user)
  } catch (err) {
    next(err)
  }
})
