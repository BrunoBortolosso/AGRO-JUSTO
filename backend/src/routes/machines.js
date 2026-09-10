import express from "express";

import { prisma } from "../db/prisma.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { badRequest, notFound } from "../utils/errors.js";
import { CreateMachineSchema } from "../validation/machines.js";

const router = express.Router();
const machineSelect = {
  id: true,
  nome: true,
  valorDia: true,
  tipo: true,
  condicoes: true,
  dias: true,
  imagem: true,
  disponibilidade: true,
  dataCadastro: true
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
    disponibilidade: machine.disponibilidade,
    createdAt: machine.dataCadastro
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

router.post("/", validate(CreateMachineSchema), async (req, res) => {
  const { nome, preco, tipo, condicoes, dias, imagem } = req.body;
  const machine = await prisma.equipamento.create({
    data: {
      usuarioId: req.user.id,
      nome,
      valorDia: preco,
      tipo,
      condicoes,
      dias,
      imagem,
      disponibilidade: true
    },
    select: machineSelect
  });

  res.status(201).json(serializeMachine(machine));
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