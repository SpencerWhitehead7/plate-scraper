import { Router } from "express";

import { isAuthenticated, isNotAlreadyAuthenticated } from "../logic/auth";
import { incorrectCredsErr } from "../logic/errors";
import { userRepository } from "../db/repositories";

const authRouter = Router();

// GET /api/auth
authRouter.get(`/`, async (req, res, next) => {
  try {
    const user = req.isAuthenticated() ? await userRepository.getById(req.user!.id) : null
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
    next(err);
  }
});

// PUT /api/auth
authRouter.put(`/`, isAuthenticated, async (req, res, next) => {
  try {
    const { user, body } = req;
    const { newEmail, newUserName, newPassword, password } = body;
    const authUser = await userRepository.getByIdWithAuth(user!.id);
    if (!authUser || !(await authUser.checkPassword(password))) throw incorrectCredsErr;

    const updatedUser = await userRepository.update(authUser.id, {
      email: newEmail,
      userName: newUserName,
      password: newPassword,
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/auth
authRouter.delete(`/`, isAuthenticated, async (req, res, next) => {
  try {
    const authUser = await userRepository.getByIdWithAuth(req.user!.id);
    if (!authUser || !(await authUser.checkPassword(req.body.password))) throw incorrectCredsErr;

    req.logout();
    await userRepository.delete(authUser);
    req.session!.destroy(err => { err ? next(err) : res.sendStatus(200) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login/
authRouter.post(`/login`, isNotAlreadyAuthenticated, async (req, res, next) => {
  try {
    const authUser = await userRepository.getByEmailWithAuth(req.body.email);
    if (!authUser || !(await authUser.checkPassword(req.body.password))) throw incorrectCredsErr;

    const { password, ...sanitizedUser } = authUser;
    req.login(authUser, err => { err ? next(err) : res.json(sanitizedUser) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
authRouter.post(`/logout`, isAuthenticated, (req, res, next) => {
  req.logout();
  req.session.destroy(err => { err ? next(err) : res.sendStatus(204) });
});

export default authRouter;
