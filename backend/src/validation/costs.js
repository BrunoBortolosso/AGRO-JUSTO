import { z } from "zod";

const category = z.enum(["INSUMO", "MAO_DE_OBRA", "TRANSPORTE", "MANUTENCAO", "OUTRO"]);

const costDate = z.preprocess(
  (value) => (typeof value === "string" ? new Date(value) : value),
  z.date()
);

const CostFields = {
  categoria: category,
  descricao: z.string().trim().min(1),
  valor: z.number().finite().positive(),
  data: costDate,
  produtoId: z.string().trim().min(1).optional()
};

const CreateCostSchema = z.object(CostFields).strict();

export { CreateCostSchema };