import express from "express";

import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginUser, registerUser } from "../services/auth.js";
import { prisma } from "../db/prisma.js";
import { LoginSchema, RegisterSchema } from "../validation/auth.js";

const router = express.Router();

router.post("/register", validate(RegisterSchema), async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

router.post("/login", validate(LoginSchema), async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

router.post("/logout", auth, async (req, res) => {
  await prisma.session.delete({ where: { id: req.session.id } });
  res.json({ success: true });
});

export { router as authRouter };