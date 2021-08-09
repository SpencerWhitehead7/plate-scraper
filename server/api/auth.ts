import { Router } from "express";

import { isAuthenticated, isNotAlreadyAuthenticated } from "../logic/auth";
import { userRepository } from "../db/repositories";

const authRouter = Router();

// GET /api/auth
authRouter.get(`/`, async (req, res, next) => {
  try {
    let user = req.isAuthenticated() ? await userRepository.getById(req.user!.id) : null
    res.json(user);
  } catch (err) {
    next(err)
  }
});

// POST /api/auth
authRouter.post(`/`, isNotAlreadyAuthenticated, async (req, res, next) => {
  try {
    const user = await userRepository.insert(req.body);
    req.login(user!, err => { err ? next(err) : res.json(user) });
  } catch (err) {
    if (err.name === `QueryFailedError`) {
      res.status(409);
    }
    next(err);
  }
});

// PUT /api/auth
authRouter.put(`/`, isAuthenticated, async (req, res, next) => {
  try {
    const { user, body } = req;
    const authUser = await userRepository.getByIdWithAuth(user!.id);
    const { newEmail, newUserName, newPassword, password } = body;
    if (authUser && await authUser.checkPassword(password)) {
      const newValues: {
        email?: string;
        userName?: string;
        password?: string;
      } = {};
      if (newEmail) newValues.email = newEmail;
      if (newUserName) newValues.userName = newUserName;
      if (newPassword) newValues.password = newPassword;
      const updatedUser = await userRepository.update(authUser.id, newValues);
      res.json(updatedUser);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/auth
authRouter.delete(`/`, isAuthenticated, async (req, res, next) => {
  try {
    const authUser = await userRepository.getByIdWithAuth(req.user!.id);
    if (authUser && await authUser.checkPassword(req.body.password)) {
      req.logout();
      await userRepository.delete(authUser);
      req!.session!.destroy(err => { err ? next(err) : res.sendStatus(200) });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login/
authRouter.post(`/login`, isNotAlreadyAuthenticated, async (req, res, next) => {
  try {
    const authUser = await userRepository.getByEmailWithAuth(req.body.email);
    if (authUser && await authUser.checkPassword(req.body.password)) {
      const { password, ...sanitizedUser } = authUser;
      req.login(authUser, err => { err ? next(err) : res.json(sanitizedUser) });
    } else {
      res.status(401);
      throw new Error(`Wrong username or password`);
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
authRouter.post(`/logout`, isAuthenticated, (req, res, next) => {
  req.logout();
  req!.session!.destroy(err => { err ? next(err) : res.sendStatus(204) });
});

export default authRouter;
