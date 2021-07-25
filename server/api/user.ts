import { Router } from "express";

import { userRepository } from "../db/repositories";

const userRouter = Router();

// GET /api/user/:id
userRouter.get(`/:id`, async (req, res, next) => {
  try {
    const user = await userRepository.getById(Number(req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
