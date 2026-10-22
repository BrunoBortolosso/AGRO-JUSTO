import express from "express";

import { prisma } from "../db/prisma.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { badRequest, notFound } from "../utils/errors.js";
import { CreateMachineSchema, UpdateMachineSchema } from "../validation/machines.js";

const router = express.Router();
const machineSelect = {
  id: true,
  nome: true,
  valorDia: true,
  tipo: true,
  condicoes: true,
  dias: true,
  imagem: true,
  localizacao: true,
  proprietario: true,
  disponibilidade: true,
  dataCadastro: true
};

const catalogMachineSelect = {
  ...machineSelect,
  usuarioId: true,
  usuario: {
    select: { nome: true, regiao: true }
  },
  alugueis: {
    where: { status: "ATIVO", finalizadoEm: null },
    select: { start: true, end: true }
  }
};

function serializeMachine(machine) {
  return {
    id: machine.id,
    nome: machine.nome,
    preco: Number(machine.valorDia),
    tipo: machine.tipo,
    condicoes: machine.condicoes,
    dias: Number(machine.dias),
    imagem: machine.imagem,
    localizacao: machine.localizacao,
    proprietario: machine.proprietario,
    disponibilidade: machine.disponibilidade,
    createdAt: machine.dataCadastro
  };
}

function serializeCatalogMachine(machine) {
  return {
    ...serializeMachine(machine),
    ownerId: machine.usuarioId,
    proprietario: machine.proprietario || machine.usuario.nome,
    localizacao: machine.localizacao || machine.usuario.regiao || "Região não informada",
    activeRentals: machine.alugueis.map(({ start, end }) => ({ start, end }))
  };
}

function parseIdParam(req) {
  const id = String(req.params.id || "").trim();
  if (!id) throw badRequest("Parâmetro 'id' inválido.");
  return id;
}

router.use(auth);

router.get("/", async (req, res) => {
  const machines = await prisma.equipamento.findMany({
    where: {
      usuarioId: req.user.id,
      excluidoEm: null
    },
    orderBy: { nome: "asc" },
    select: machineSelect
  });

  res.json(machines.map(serializeMachine));
});

router.get("/catalog", async (_req, res) => {
  const machines = await prisma.equipamento.findMany({
    where: { excluidoEm: null },
    orderBy: { nome: "asc" },
    select: catalogMachineSelect
  });

  res.json(machines.map(serializeCatalogMachine));
});

router.post("/", validate(CreateMachineSchema), async (req, res) => {
  const { nome, preco, tipo, condicoes, dias, imagem, localizacao, proprietario } = req.body;
  const machine = await prisma.equipamento.create({
    data: {
      usuarioId: req.user.id,
      nome,
      valorDia: preco,
      tipo,
      condicoes,
      dias,
      imagem,
      localizacao,
      proprietario,
      disponibilidade: true
    },
    select: machineSelect
  });

  res.status(201).json(serializeMachine(machine));
});

router.patch("/:id", validate(UpdateMachineSchema), async (req, res) => {
  const id = parseIdParam(req);
  const data = {
    ...(req.body.nome !== undefined ? { nome: req.body.nome } : {}),
    ...(req.body.preco !== undefined ? { valorDia: req.body.preco } : {}),
    ...(req.body.tipo !== undefined ? { tipo: req.body.tipo } : {}),
    ...(req.body.condicoes !== undefined ? { condicoes: req.body.condicoes } : {}),
    ...(req.body.dias !== undefined ? { dias: req.body.dias } : {}),
    ...(req.body.imagem !== undefined ? { imagem: req.body.imagem } : {}),
    ...(req.body.localizacao !== undefined ? { localizacao: req.body.localizacao } : {}),
    ...(req.body.proprietario !== undefined ? { proprietario: req.body.proprietario } : {}),
    ...(req.body.disponibilidade !== undefined ? { disponibilidade: req.body.disponibilidade } : {})
  };
  const updated = await prisma.equipamento.updateMany({
    where: { id, usuarioId: req.user.id, excluidoEm: null },
    data
  });
  if (!updated.count) throw notFound("Máquina não encontrada.");

  const machine = await prisma.equipamento.findUnique({ where: { id }, select: machineSelect });
  res.json(serializeMachine(machine));
});

router.delete("/:id", async (req, res) => {
  const id = parseIdParam(req);
  const result = await prisma.equipamento.updateMany({
    where: {
      id,
      usuarioId: req.user.id,
      excluidoEm: null
    },
    data: {
      excluidoEm: new Date(),
      disponibilidade: false
    }
  });
  if (!result.count) throw notFound("Máquina não encontrada.");

  res.status(204).send();
});

export { router as machinesRouter };