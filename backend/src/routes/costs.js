import express from "express";

import { prisma } from "../db/prisma.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { notFound } from "../utils/errors.js";
import { CreateCostSchema } from "../validation/costs.js";

const router = express.Router();

function serializeCost(cost) {
  return {
    id: cost.id,
    categoria: cost.tipo,
    descricao: cost.descricao,
    valor: Number(cost.valor),
    data: cost.dataRegistro.toISOString().slice(0, 10),
    produtoId: cost.produtoId
  };
}

router.use(auth);

router.get("/", async (req, res) => {
  const costs = await prisma.custo.findMany({
    where: { usuarioId: req.user.id },
    orderBy: { dataRegistro: "desc" },
    select: {
      id: true,
      tipo: true,
      descricao: true,
      valor: true,
      dataRegistro: true,
      produtoId: true
    }
  });

  res.json(costs.map(serializeCost));
});

router.post("/", validate(CreateCostSchema), async (req, res) => {
  const { categoria, descricao, valor, data, produtoId } = req.body;

  if (produtoId) {
    const product = await prisma.produto.findFirst({
      where: { id: produtoId, usuarioId: req.user.id },
      select: { id: true }
    });
    if (!product) throw notFound("Produto não encontrado.");
  }

  const cost = await prisma.custo.create({
    data: {
      usuarioId: req.user.id,
      tipo: categoria,
      descricao,
      valor,
      dataRegistro: data,
      produtoId
    },
    select: {
      id: true,
      tipo: true,
      descricao: true,
      valor: true,
      dataRegistro: true,
      produtoId: true
    }
  });

  res.status(201).json(serializeCost(cost));
});

router.delete("/:id", async (req, res) => {
  const deleted = await prisma.custo.deleteMany({
    where: { id: String(req.params.id || "").trim(), usuarioId: req.user.id }
  });
  if (!deleted.count) throw notFound("Custo não encontrado.");

  res.status(204).send();
});

router.get("/summary", async (req, res) => {
  const costs = await prisma.custo.findMany({
    where: { usuarioId: req.user.id },
    select: { tipo: true, valor: true }
  });
  const totals = new Map();

  for (const cost of costs) {
    totals.set(cost.tipo, (totals.get(cost.tipo) || 0) + Number(cost.valor));
  }

  const categories = [...totals.entries()].map(([categoria, total]) => ({
    categoria,
    total: Number(total.toFixed(2))
  })).sort((left, right) => right.total - left.total);
  const total = Number(categories.reduce((sum, item) => sum + item.total, 0).toFixed(2));

  res.json({ total, categories });
});

export { router as costsRouter };