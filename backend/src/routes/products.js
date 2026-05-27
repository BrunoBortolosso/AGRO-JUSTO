const express = require("express");
const { prisma } = require("../db/prisma");

const router = express.Router();

function parseIdParam(req) {
  return String(req.params.id || "").trim();
}

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nome: true,
      quantidade: true,
      unidade: true,
      preco: true,
      createdAt: true
    }
  });

  res.json(products);
});

router.post("/", async (req, res) => {
  const nome = String(req.body?.nome || "").trim();
  const quantidade = Number(req.body?.quantidade ?? 0);
  const unidade = String(req.body?.unidade || "").trim();
  const preco = req.body?.preco;

  if (!nome) return res.status(400).json({ error: "Campo 'nome' é obrigatório." });
  if (!unidade) return res.status(400).json({ error: "Campo 'unidade' é obrigatório." });

  const product = await prisma.product.create({
    data: {
      nome,
      quantidade: Number.isFinite(quantidade) ? Math.max(0, Math.trunc(quantidade)) : 0,
      unidade,
      preco: preco === null || preco === undefined || preco === "" ? null : Number(preco)
    },
    select: {
      id: true,
      nome: true,
      quantidade: true,
      unidade: true,
      preco: true,
      createdAt: true
    }
  });

  res.status(201).json(product);
});

router.patch("/:id", async (req, res) => {
  const id = parseIdParam(req);
  if (!id) return res.status(400).json({ error: "Parâmetro 'id' inválido." });

  const data = {};
  if (req.body?.nome !== undefined) data.nome = String(req.body.nome).trim();
  if (req.body?.quantidade !== undefined) {
    const quantidade = Number(req.body.quantidade);
    data.quantidade = Number.isFinite(quantidade) ? Math.max(0, Math.trunc(quantidade)) : 0;
  }
  if (req.body?.unidade !== undefined) data.unidade = String(req.body.unidade).trim();
  if (req.body?.preco !== undefined) {
    const preco = req.body.preco;
    data.preco = preco === null || preco === "" ? null : Number(preco);
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        quantidade: true,
        unidade: true,
        preco: true,
        createdAt: true
      }
    });
    res.json(product);
  } catch (e) {
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseIdParam(req);
  if (!id) return res.status(400).json({ error: "Parâmetro 'id' inválido." });

  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    throw e;
  }
});

module.exports = { productsRouter: router };
