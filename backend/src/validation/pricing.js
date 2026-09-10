import { z } from "zod";

const positiveNumber = z.number().finite().positive();

const CreatePricingSimulationSchema = z.object({
  insumos: positiveNumber,
  maoDeObra: positiveNumber,
  transporteBase: positiveNumber,
  manutencao: positiveNumber,
  distanciaKm: positiveNumber,
  custoPorKm: positiveNumber,
  quantidade: positiveNumber,
  margem: positiveNumber,
  oferta: positiveNumber.max(2),
  demanda: positiveNumber.max(2),
  produtoId: z.string().trim().min(1).optional()
}).strict();

export { CreatePricingSimulationSchema };