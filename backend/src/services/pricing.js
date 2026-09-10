import { prisma } from "../db/prisma.js";
import { notFound, validationError } from "../utils/errors.js";

function roundMoney(value) {
  return Number(value.toFixed(2));
}

function calculatePricing({
  insumos,
  maoDeObra,
  transporteBase,
  manutencao,
  distanciaKm,
  custoPorKm,
  quantidade,
  margem,
  oferta,
  demanda
}) {
  if (!Number.isFinite(oferta) || oferta <= 0) {
    throw validationError("Oferta deve ser maior que zero.");
  }

  const transporteTotal = transporteBase + distanciaKm * custoPorKm;
  const custoTotal = insumos + maoDeObra + manutencao + transporteTotal;
  const custoUnitario = custoTotal / quantidade;
  const precoMinimo = custoUnitario;
  const fatorMercado = Math.min(1.5, Math.max(0.7, demanda / oferta));
  const precoIdeal = precoMinimo * (1 + margem / 100) * fatorMercado;

  return {
    custoTotal: roundMoney(custoTotal),
    custoUnitario: roundMoney(custoUnitario),
    precoMinimo: roundMoney(precoMinimo),
    precoIdeal: roundMoney(precoIdeal)
  };
}

const simulationSelect = {
  id: true,
  produtoId: true,
  insumos: true,
  maoDeObra: true,
  transporteBase: true,
  manutencao: true,
  distanciaKm: true,
  custoPorKm: true,
  quantidade: true,
  margem: true,
  oferta: true,
  demanda: true,
  custoTotal: true,
  custoUnitario: true,
  precoMinimo: true,
  precoIdeal: true,
  dataCalculo: true
};

function serializeSimulation(simulation) {
  const decimalFields = [
    "insumos",
    "maoDeObra",
    "transporteBase",
    "manutencao",
    "distanciaKm",
    "custoPorKm",
    "quantidade",
    "margem",
    "oferta",
    "demanda",
    "custoTotal",
    "custoUnitario",
    "precoMinimo",
    "precoIdeal"
  ];
  const result = { id: simulation.id, produtoId: simulation.produtoId, createdAt: simulation.dataCalculo };

  for (const field of decimalFields) result[field] = Number(simulation[field]);
  return result;
}

async function createPricingSimulation(userId, input) {
  if (input.produtoId) {
    const product = await prisma.produto.findFirst({
      where: { id: input.produtoId, usuarioId: userId },
      select: { id: true }
    });
    if (!product) throw notFound("Produto não encontrado.");
  }

  const results = calculatePricing(input);
  const simulation = await prisma.precoJusto.create({
    data: {
      usuarioId: userId,
      produtoId: input.produtoId,
      insumos: input.insumos,
      maoDeObra: input.maoDeObra,
      transporteBase: input.transporteBase,
      manutencao: input.manutencao,
      distanciaKm: input.distanciaKm,
      custoPorKm: input.custoPorKm,
      quantidade: input.quantidade,
      margem: input.margem,
      oferta: input.oferta,
      demanda: input.demanda,
      ...results,
      margemLucro: input.margem,
      quantidadeProduzida: input.quantidade
    },
    select: simulationSelect
  });

  return serializeSimulation(simulation);
}

async function listPricingSimulations(userId, page, limit) {
  const where = { usuarioId: userId };
  const [items, total] = await Promise.all([
    prisma.precoJusto.findMany({
      where,
      orderBy: { dataCalculo: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: simulationSelect
    }),
    prisma.precoJusto.count({ where })
  ]);

  return {
    items: items.map(serializeSimulation),
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit))
  };
}

export { calculatePricing, createPricingSimulation, listPricingSimulations };