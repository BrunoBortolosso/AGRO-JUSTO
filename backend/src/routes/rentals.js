import express from "express";

import { prisma } from "../db/prisma.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { AppError, conflict, notFound } from "../utils/errors.js";
import { CreateRentalSchema } from "../validation/rentals.js";

const router = express.Router();
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function inclusiveDays(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / MILLISECONDS_PER_DAY) + 1;
}

function serializeRental(rental) {
  return {
    id: rental.id,
    tenant: rental.tenant,
    machineId: rental.machineId,
    machineName: rental.equipamento.nome,
    start: rental.start,
    end: rental.end,
    notes: rental.notes,
    dailyPrice: Number(rental.dailyPrice),
    total: Number(rental.total),
    finished: rental.finalizadoEm !== null,
    createdAt: rental.createdAt,
    finishedAt: rental.finalizadoEm
  };
}

const rentalInclude = {
  equipamento: { select: { nome: true } }
};

router.use(auth);

router.get("/", async (req, res) => {
  const rentals = await prisma.aluguel.findMany({
    where: { usuarioId: req.user.id },
    orderBy: { start: "desc" },
    include: rentalInclude
  });

  res.json(rentals.map(serializeRental));
});

router.post("/", validate(CreateRentalSchema), async (req, res) => {
  const rental = await prisma.$transaction(async (tx) => {
    const machine = await tx.equipamento.findFirst({
      where: {
        id: req.body.machineId,
        usuarioId: req.user.id,
        excluidoEm: null
      }
    });
    if (!machine) throw notFound("Máquina não encontrada.");
    if (!machine.disponibilidade) throw conflict("Máquina indisponível.");

    const activeRental = await tx.aluguel.findFirst({
      where: {
        machineId: machine.id,
        usuarioId: req.user.id,
        finalizadoEm: null
      },
      select: { id: true }
    });
    if (activeRental) throw conflict("Máquina já possui um aluguel ativo.");

    const days = inclusiveDays(req.body.start, req.body.end);
    const dailyPrice = Number(machine.valorDia);
    const total = Number((days * dailyPrice).toFixed(2));
    const reserved = await tx.equipamento.updateMany({
      where: {
        id: machine.id,
        usuarioId: req.user.id,
        excluidoEm: null,
        disponibilidade: true
      },
      data: { disponibilidade: false }
    });
    if (!reserved.count) throw conflict("Máquina indisponível.");

    return tx.aluguel.create({
      data: {
        machineId: machine.id,
        usuarioId: req.user.id,
        tenant: req.body.tenant,
        start: req.body.start,
        end: req.body.end,
        dailyPrice,
        total,
        notes: req.body.notes,
        status: "ATIVO"
      },
      include: rentalInclude
    });
  });

  res.status(201).json(serializeRental(rental));
});

router.post("/:id/finish", async (req, res) => {
  const rental = await prisma.$transaction(async (tx) => {
    const rentalRecord = await tx.aluguel.findFirst({
      where: {
        id: String(req.params.id || "").trim(),
        usuarioId: req.user.id
      },
      select: { id: true, machineId: true, finalizadoEm: true }
    });
    if (!rentalRecord) throw notFound("Aluguel não encontrado.");
    if (rentalRecord.finalizadoEm) {
      throw new AppError("Aluguel já finalizado.", 409, "RENTAL_ALREADY_FINISHED");
    }

    const finishedAt = new Date();
    const finished = await tx.aluguel.updateMany({
      where: {
        id: rentalRecord.id,
        usuarioId: req.user.id,
        finalizadoEm: null
      },
      data: {
        finalizadoEm: finishedAt,
        status: "CONCLUIDO"
      }
    });
    if (!finished.count) {
      throw new AppError("Aluguel já finalizado.", 409, "RENTAL_ALREADY_FINISHED");
    }

    await tx.equipamento.updateMany({
      where: { id: rentalRecord.machineId, usuarioId: req.user.id },
      data: { disponibilidade: true }
    });

    return tx.aluguel.findUnique({
      where: { id: rentalRecord.id },
      include: rentalInclude
    });
  });

  res.json(serializeRental(rental));
});

export { router as rentalsRouter };