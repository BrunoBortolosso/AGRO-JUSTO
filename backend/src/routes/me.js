import express from "express";

import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateUser } from "../services/auth.js";
import { UpdateMeSchema } from "../validation/auth.js";

const router = express.Router();

router.get("/", auth, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/", auth, validate(UpdateMeSchema), async (req, res) => {
  const user = await updateUser(req.user.id, req.body);
  res.json({ user });
});

export { router as meRouter };