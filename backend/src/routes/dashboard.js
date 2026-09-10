import express from "express";

import { auth } from "../middlewares/auth.js";
import { getDashboard } from "../services/dashboard.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const dashboard = await getDashboard(req.user.id);
  res.json(dashboard);
});

export { router as dashboardRouter };