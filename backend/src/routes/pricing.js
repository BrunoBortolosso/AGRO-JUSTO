import express from "express";

import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { badRequest } from "../utils/errors.js";
import {
  createPricingSimulation,
  listPricingSimulations
} from "../services/pricing.js";
import { CreatePricingSimulationSchema } from "../validation/pricing.js";

const router = express.Router();

function parsePagination(req) {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1) throw badRequest("Parâmetro 'page' inválido.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw badRequest("Parâmetro 'limit' inválido.");
  }

  return { page, limit };
}

router.use(auth);

router.post("/simulations", validate(CreatePricingSimulationSchema), async (req, res) => {
  const simulation = await createPricingSimulation(req.user.id, req.body);
  res.status(201).json(simulation);
});

router.get("/simulations", async (req, res) => {
  const { page, limit } = parsePagination(req);
  const result = await listPricingSimulations(req.user.id, page, limit);
  res.json(result);
});

export { router as pricingRouter };