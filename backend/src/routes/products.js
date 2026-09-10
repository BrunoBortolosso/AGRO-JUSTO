import express from "express";

import { prisma } from "../db/prisma.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { badRequest, notFound } from "../utils/errors.js";
import { CreateProductSchema, UpdateProductSchema } from "../validation/products.js";

const router = express.Router();
const productSelect = {
  id: true,
  nome: true,
  quantidade: true,
  unidadeMedida: true,
  tipoCultivo: true,
  regiao: true,
  preco: true,
  imagem: true,
  dataCadastro: true
};

function parseIdParam(req) {
  const id = String(req.params.id || "").trim();
  if (!id) throw badRequest("Parâmetro 'id' inválido.");
  return id;
}

function serializeProduct(product) {
  return {
    id: product.id,
    nome: product.nome,
    quantidade: Number(product.quantidade),
    unidade: product.unidadeMedida,
    cultivo: product.tipoCultivo,
    regiao: product.regiao,
    preco: Number(product.preco),
    imagem: product.imagem,
    createdAt: product.dataCadastro
  };
}

router.use(auth);

router.get("/", async (req, res) => {
  const products = await prisma.produto.findMany({
    where: { usuarioId: req.user.id },
    orderBy: { dataCadastro: "desc" },
    select: productSelect
  });

  res.json(products.map(serializeProduct));
});

router.post("/", validate(CreateProductSchema), async (req, res) => {
  const { nome, quantidade, unidade, cultivo, regiao, preco, imagem } = req.body;
  const product = await prisma.produto.create({
    data: {
      usuarioId: req.user.id,
      nome,
      quantidade,
      unidadeMedida: unidade,
      tipoCultivo: cultivo,
      regiao,
      preco,
      imagem
    },
    select: productSelect
  });

  res.status(201).json(serializeProduct(product));
});

router.patch("/:id", validate(UpdateProductSchema), async (req, res) => {
  const id = parseIdParam(req);
  const data = {};
  const fields = ["nome", "quantidade", "unidade", "cultivo", "regiao", "preco", "imagem"];

  for (const field of fields) {
    if (req.body[field] === undefined) continue;
    const databaseField = {
      unidade: "unidadeMedida",
      cultivo: "tipoCultivo"
    }[field] || field;
    data[databaseField] = req.body[field];
  }

  const updated = await prisma.produto.updateMany({
    where: { id, usuarioId: req.user.id },
    data
  });
  if (!updated.count) throw notFound("Produto não encontrado.");

  const product = await prisma.produto.findUnique({
    where: { id },
    select: productSelect
  });
  res.json(serializeProduct(product));
});

router.delete("/:id", async (req, res) => {
  const id = parseIdParam(req);
  const deleted = await prisma.produto.deleteMany({
    where: { id, usuarioId: req.user.id }
  });
  if (!deleted.count) throw notFound("Produto não encontrado.");

  res.status(204).send();
});

export const productsRouter = router;
