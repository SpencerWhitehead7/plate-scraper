import { Router } from "express";

import { isAuthenticated, isNotAlreadyAuthenticated } from "../logic/auth";
import { serializers, incorrectCredsErr } from "../logic/errors";
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
authRouter.post(`/`, isNotAlreadyAuthenticated, ...serializers.auth.post, async (req, res, next) => {
  try {
    const { email, userName, password, } = req.body
    const user = await userRepository.insert({
      email,
      userName,
      password,
    });
    req.login(user!, err => { err ? next(err) : res.json(user) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth
authRouter.put(`/`, isAuthenticated, ...serializers.auth.put, async (req, res, next) => {
  try {
    const { newEmail, newUserName, newPassword, password } = req.body;
    const authUser = await userRepository.getByIdWithAuth(req.user!.id);
    if (!authUser || !(await authUser.checkPassword(password))) throw incorrectCredsErr;

    const updatedUserData: { email?: string; userName?: string; password?: string } = {};
    if (newEmail) updatedUserData.email = newEmail;
    if (newUserName) updatedUserData.userName = newUserName;
    if (newPassword) updatedUserData.password = newPassword;

    const updatedUser = await userRepository.update(authUser.id, updatedUserData);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/auth
authRouter.delete(`/`, isAuthenticated, ...serializers.auth.delete, async (req, res, next) => {
  try {
    const { password } = req.body;
    const authUser = await userRepository.getByIdWithAuth(req.user!.id);
    if (!authUser || !(await authUser.checkPassword(password))) throw incorrectCredsErr;

    req.logout();
    await userRepository.delete(authUser);
    req.session!.destroy(err => { err ? next(err) : res.sendStatus(200) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login/
authRouter.post(`/login`, isNotAlreadyAuthenticated, ...serializers.auth.login.post, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authUser = await userRepository.getByEmailWithAuth(email);
    if (!authUser || !(await authUser.checkPassword(password))) throw incorrectCredsErr;

    const { password: removedPassword, ...sanitizedUser } = authUser;
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
