import express from "express";

import { prisma } from "../db/prisma.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { AppError, conflict, notFound } from "../utils/errors.js";
import { inclusiveDays, rentalOverlapFilter } from "../services/rentals.js";
import { CreateRentalSchema } from "../validation/rentals.js";

const router = express.Router();

function serializeRental(rental, userId) {
  return {
    id: rental.id,
    tenant: rental.locatario?.nome || rental.tenant,
    renterId: rental.locatarioId,
    ownerId: rental.usuarioId,
    isOwner: rental.usuarioId === userId,
    isRenter: rental.locatarioId === userId,
    machineId: rental.machineId,
    machineName: rental.equipamento.nome,
    start: rental.start,
    end: rental.end,
    notes: rental.notes,
    dailyPrice: Number(rental.dailyPrice),
    total: Number(rental.total),
    status: rental.status,
    finished: rental.finalizadoEm !== null,
    createdAt: rental.createdAt,
    finishedAt: rental.finalizadoEm
  };
}

const rentalInclude = {
  equipamento: { select: { nome: true } },
  locador: { select: { id: true, nome: true } },
  locatario: { select: { id: true, nome: true } }
};

router.use(auth);

router.get("/", async (req, res) => {
  const rentals = await prisma.aluguel.findMany({
    where: {
      OR: [
        { usuarioId: req.user.id },
        { locatarioId: req.user.id }
      ]
    },
    orderBy: { start: "desc" },
    include: rentalInclude
  });

  res.json(rentals.map((rental) => serializeRental(rental, req.user.id)));
});

router.post("/", validate(CreateRentalSchema), async (req, res) => {
  const rental = await prisma.$transaction(async (tx) => {
    const machine = await tx.equipamento.findFirst({
      where: {
        id: req.body.machineId,
        excluidoEm: null
      }
    });
    if (!machine) throw notFound("Máquina não encontrada.");
    if (machine.usuarioId === req.user.id) {
      throw conflict("Não é possível alugar uma máquina cadastrada pela própria conta.");
    }

    const activeRental = await tx.aluguel.findFirst({
      where: rentalOverlapFilter(machine.id, req.body.start, req.body.end),
      select: { id: true }
    });
    if (activeRental) throw conflict("A máquina já está reservada nesse período.");

    if (!machine.disponibilidade) {
      const existingActiveRental = await tx.aluguel.findFirst({
        where: { machineId: machine.id, status: "ATIVO", finalizadoEm: null },
        select: { id: true }
      });
      if (!existingActiveRental) throw conflict("Máquina indisponível.");
    }

    const days = inclusiveDays(req.body.start, req.body.end);
    const dailyPrice = Number(machine.valorDia);
    const total = Number((days * dailyPrice).toFixed(2));
    return tx.aluguel.create({
      data: {
        machineId: machine.id,
        usuarioId: machine.usuarioId,
        locatarioId: req.user.id,
        tenant: req.user.nome,
        start: req.body.start,
        end: req.body.end,
        dailyPrice,
        total,
        notes: req.body.notes,
        status: "ATIVO"
      },
      include: rentalInclude
    });
  }, { isolationLevel: "Serializable" });

  res.status(201).json(serializeRental(rental, req.user.id));
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

    const remainingActiveRentals = await tx.aluguel.count({
      where: {
        machineId: rentalRecord.machineId,
        status: "ATIVO",
        finalizadoEm: null
      }
    });
    if (!remainingActiveRentals) {
      await tx.equipamento.updateMany({
        where: { id: rentalRecord.machineId, usuarioId: req.user.id },
        data: { disponibilidade: true }
      });
    }

    return tx.aluguel.findUnique({
      where: { id: rentalRecord.id },
      include: rentalInclude
    });
  });

  res.json(serializeRental(rental, req.user.id));
});

export { router as rentalsRouter };