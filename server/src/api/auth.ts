import { Router } from "express"

import {
  DeleteMeReq,
  EditMeReq,
  LoginReq,
  SignUpReq,
} from "../@types/apiContract"
import { userRepository } from "../db/repositories"
import { isAuthenticated, isNotAlreadyAuthenticated } from "../logic/auth"
import { incorrectCredsErr, serializers } from "../logic/errors"

export const authRouter = Router()

// GET /api/auth
authRouter.get("/", async (req, res, next) => {
  try {
    const user = req.isAuthenticated()
      ? await userRepository.getById(req.user.id)
      : null
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// POST /api/auth
authRouter.post(
  "/",
  isNotAlreadyAuthenticated,
  ...serializers.auth.post,
  async (req, res, next) => {
    try {
      const { email, userName, password } = req.body as SignUpReq
      const user = await userRepository.insert({
        email,
        userName,
        password,
      })
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.login(user!, (err) => {
        err ? next(err) : res.json(user)
      })
    } catch (err) {
      next(err)
    }
  },
)

// PUT /api/auth
authRouter.put(
  "/",
  isAuthenticated,
  ...serializers.auth.put,
  async (req, res, next) => {
    try {
      const { newEmail, newUserName, newPassword, password } =
        req.body as EditMeReq
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const authUser = await userRepository.getByIdWithAuth(req.user!.id)
      if (!authUser || !(await authUser.checkPassword(password)))
        throw incorrectCredsErr

      const updatedUserData: {
        email?: string
        userName?: string
        password?: string
      } = {}
      if (newEmail) updatedUserData.email = newEmail
      if (newUserName) updatedUserData.userName = newUserName
      if (newPassword) updatedUserData.password = newPassword

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
  isAuthenticated,
  ...serializers.auth.delete,
  async (req, res, next) => {
    try {
      const { password } = req.body as DeleteMeReq
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const authUser = await userRepository.getByIdWithAuth(req.user!.id)
      if (!authUser || !(await authUser.checkPassword(password)))
        throw incorrectCredsErr

      req.logout((err) => {
        if (err) {
          next(err)
        } else {
          req.session.destroy(async (err) => {
            if (err) {
              next(err)
            } else {
              try {
                await userRepository.delete(authUser)
                res.sendStatus(204)
              } catch (err) {
                next(err)
              }
            }
          })
        }
      })
    } catch (err) {
      next(err)
    }
  },
)

// POST /api/auth/session
authRouter.post(
  "/session",
  isNotAlreadyAuthenticated,
  ...serializers.auth.session.post,
  async (req, res, next) => {
    try {
      const { email, password } = req.body as LoginReq
      const authUser = await userRepository.getByEmailWithAuth(email)
      if (!authUser || !(await authUser.checkPassword(password)))
        throw incorrectCredsErr

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: removedPassword, ...sanitizedUser } = authUser
      req.login(authUser, (err) => {
        err ? next(err) : res.json(sanitizedUser)
      })
    } catch (err) {
      next(err)
    }
  },
)

// DELETE /api/auth/session
authRouter.delete("/session", isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err)
    } else {
      req.session.destroy((err) => {
        if (err) {
          next(err)
        } else {
          res.sendStatus(204)
        }
      })
    }
  })
})
