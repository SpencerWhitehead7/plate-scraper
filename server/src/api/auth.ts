import { Router } from "express"

import {
  authDeleteSchema,
  authPostSchema,
  authPutSchema,
  authSessionPostSchema,
} from "../@types/apiContract"
import { userRepository } from "../db/repositories"
import { isAuthenticated, isNotAuthenticated } from "../logic/auth"
import { incorrectCredsErr } from "../logic/errors"
import { validate } from "../logic/serialization"

export const authRouter = Router()

// GET /api/auth
authRouter.get("/", isAuthenticated(), async (req, res, next) => {
  try {
    // @ts-expect-error added by isAuthenticated middleware
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const user = await userRepository.getById(req.userId)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.refreshTrigger += 1
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.session!.refreshTrigger %= 2
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// POST /api/auth
authRouter.post(
  "/",
  isNotAuthenticated(),
  validate(authPostSchema),
  async (req, res, next) => {
    try {
      const userData = req.body
      const user = await userRepository.insert(userData)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.session!.userId = user.id
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.session!.refreshTrigger = 0
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
)

// PUT /api/auth
authRouter.put(
  "/",
  isAuthenticated(),
  validate(authPutSchema),
  async (req, res, next) => {
    try {
      const { password, updatedUserData } = req.body
      // @ts-expect-error added by isAuthenticated middleware
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const authUser = await userRepository.getByIdWithAuth(req.userId)
      if (!authUser || !(await authUser.checkPassword(password)))
        throw incorrectCredsErr

      const updatedUser = await userRepository.update(
        authUser.id,
        updatedUserData,
      )
      res.json(updatedUser)
    } catch (err) {
      next(err)
    }
  },
)

// DELETE /api/auth
authRouter.delete(
  "/",
  isAuthenticated(),
  validate(authDeleteSchema),
  async (req, res, next) => {
    try {
      const { password } = req.body
      // @ts-expect-error added by isAuthenticated middleware
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const authUser = await userRepository.getByIdWithAuth(req.userId)
      if (!authUser || !(await authUser.checkPassword(password)))
        throw incorrectCredsErr

      await userRepository.delete(authUser)
      req.session = null
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  },
)

// POST /api/auth/session
authRouter.post(
  "/session",
  isNotAuthenticated(),
  validate(authSessionPostSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body
      const authUser = await userRepository.getByEmailWithAuth(email)
      if (!authUser || !(await authUser.checkPassword(password)))
        throw incorrectCredsErr

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: removedPassword, ...sanitizedUser } = authUser
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.session!.userId = authUser.id
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.session!.refreshTrigger = 0
      res.json(sanitizedUser)
    } catch (err) {
      next(err)
    }
  },
)

// DELETE /api/auth/session
authRouter.delete("/session", isAuthenticated(), (req, res, next) => {
  try {
    req.session = null
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
