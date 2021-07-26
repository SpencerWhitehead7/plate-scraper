import { Router } from "express";

import { userRepository } from "../db/repositories";
import { notFoundUserErr } from "../logic/errors"

const userRouter = Router();

// GET /api/user/:id
userRouter.get(`/:id`, async (req, res, next) => {
  try {
    const user = await userRepository.getById(Number(req.params.id));
    if (!user) throw notFoundUserErr;

    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default userRouter;
