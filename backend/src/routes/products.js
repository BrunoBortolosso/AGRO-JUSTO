import express from "express";
import { prisma } from "../db/prisma.js";

const router = express.Router();

function parseIdParam(req) {
  return String(req.params.id || "").trim();
}

function getUserId(req) {
  return String(req.headers["x-user-id"] || process.env.DEFAULT_USER_ID || "").trim();
}

function serializeProduct(product) {
  return {
    id: product.id,
    nome: product.nome,
    quantidade: product.quantidade,
    unidade: product.unidadeMedida,
    preco: null,
    createdAt: product.dataCadastro
  };
}

router.get("/", async (req, res) => {
  const usuarioId = getUserId(req);
  if (!usuarioId) return res.status(503).json({ error: "Configure DEFAULT_USER_ID para acessar produtos." });

  const products = await prisma.produto.findMany({
    where: { usuarioId },
    orderBy: { dataCadastro: "desc" },
    select: {
      id: true,
      nome: true,
      quantidade: true,
      unidadeMedida: true,
      dataCadastro: true
    }
  });

  res.json(products.map(serializeProduct));
});

router.post("/", async (req, res) => {
  const usuarioId = getUserId(req);
  if (!usuarioId) return res.status(503).json({ error: "Configure DEFAULT_USER_ID para cadastrar produtos." });
  const nome = String(req.body?.nome || "").trim();
  const quantidade = Number(req.body?.quantidade ?? 0);
  const unidade = String(req.body?.unidade || "").trim();

  if (!nome)
    return res.status(400).json({ error: "Campo 'nome' é obrigatório." });
  if (!unidade)
    return res.status(400).json({ error: "Campo 'unidade' é obrigatório." });

  const product = await prisma.produto.create({
    data: {
      usuarioId,
      nome,
      quantidade: Number.isFinite(quantidade)
        ? Math.max(0, Math.trunc(quantidade))
        : 0,
      unidadeMedida: unidade,
      tipoCultivo: "convencional"
    },
    select: {
      id: true,
      nome: true,
      quantidade: true,
      unidadeMedida: true,
      dataCadastro: true
    }
  });

  res.status(201).json(serializeProduct(product));
});

router.patch("/:id", async (req, res) => {
  const id = parseIdParam(req);
  if (!id) return res.status(400).json({ error: "Parâmetro 'id' inválido." });
  const usuarioId = getUserId(req);
  if (!usuarioId) return res.status(503).json({ error: "Configure DEFAULT_USER_ID para editar produtos." });

  const data = {};
  if (req.body?.nome !== undefined) data.nome = String(req.body.nome).trim();
  if (req.body?.quantidade !== undefined) {
    const quantidade = Number(req.body.quantidade);
    data.quantidade = Number.isFinite(quantidade)
      ? Math.max(0, Math.trunc(quantidade))
      : 0;
  }
  if (req.body?.unidade !== undefined) data.unidadeMedida = String(req.body.unidade).trim();

  try {
    const product = await prisma.produto.updateMany({
      where: { id, usuarioId },
      data,
    });
    if (!product.count) return res.status(404).json({ error: "Produto não encontrado." });
    const updated = await prisma.produto.findUnique({
      where: { id },
      select: { id: true, nome: true, quantidade: true, unidadeMedida: true, dataCadastro: true }
    });
    res.json(serializeProduct(updated));
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
  const usuarioId = getUserId(req);
  if (!usuarioId) return res.status(503).json({ error: "Configure DEFAULT_USER_ID para excluir produtos." });

  try {
    const product = await prisma.produto.deleteMany({ where: { id, usuarioId } });
    if (!product.count) return res.status(404).json({ error: "Produto não encontrado." });
    res.status(204).send();
  } catch (e) {
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    throw e;
  }
});

export const productsRouter = router;
