import { prisma } from "../db/prisma.js";
import { notFound } from "../utils/errors.js";

function roundMoney(value) {
  return Number(value.toFixed(2));
}

function numberOrZero(value) {
  return Number(value ?? 0);
}

function buildCostComposition(costs) {
  const totals = new Map();

  for (const cost of costs) {
    const categoryTotal = totals.get(cost.tipo) || 0;
    totals.set(cost.tipo, categoryTotal + numberOrZero(cost.valor));
  }

  return [...totals.entries()]
    .filter(([, total]) => total > 0)
    .map(([categoria, total]) => ({ categoria, total: roundMoney(total) }))
    .sort((left, right) => right.total - left.total);
}

function buildLatestComparison(simulation) {
  if (!simulation) {
    return { precoMinimo: 0, precoIdeal: 0, diferenca: 0, percentual: 0 };
  }

  const precoMinimo = numberOrZero(simulation.precoMinimo);
  const precoIdeal = numberOrZero(simulation.precoIdeal);
  const diferenca = precoIdeal - precoMinimo;
  const percentual = precoMinimo === 0 ? 0 : (diferenca / precoMinimo) * 100;

  return {
    precoMinimo: roundMoney(precoMinimo),
    precoIdeal: roundMoney(precoIdeal),
    diferenca: roundMoney(diferenca),
    percentual: roundMoney(percentual)
  };
}

async function getDashboard(userId) {
  const [profile, productsCount, machinesCount, simulations] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true, regiao: true }
    }),
    prisma.produto.count({ where: { usuarioId: userId } }),
    prisma.equipamento.count({ where: { usuarioId: userId, excluidoEm: null } }),
    prisma.precoJusto.findMany({
      where: { usuarioId: userId },
      orderBy: { dataCalculo: "desc" },
      take: 20,
      select: {
        produtoId: true,
        precoMinimo: true,
        precoIdeal: true
      }
    })
  ]);

  if (!profile) throw notFound("Usuário não encontrado.");

  const productIds = [...new Set(
    simulations.map((simulation) => simulation.produtoId).filter(Boolean)
  )];
  const costs = productIds.length === 0
    ? []
    : await prisma.custo.findMany({
      where: {
        usuarioId: userId,
        produtoId: { in: productIds }
      },
      select: { tipo: true, valor: true }
    });

  const idealTotal = simulations.reduce(
    (total, simulation) => total + numberOrZero(simulation.precoIdeal),
    0
  );

  return {
    profile,
    productsCount,
    machinesCount,
    averageIdealPrice: simulations.length === 0
      ? 0
      : roundMoney(idealTotal / simulations.length),
    costComposition: buildCostComposition(costs),
    latestSimulationComparison: buildLatestComparison(simulations[0])
  };
}

export { getDashboard };