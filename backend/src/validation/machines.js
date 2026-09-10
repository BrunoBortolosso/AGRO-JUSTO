import { z } from "zod";

const CreateMachineSchema = z.object({
  nome: z.string().trim().min(1),
  preco: z.number().finite().positive(),
  tipo: z.string().trim().min(1),
  condicoes: z.string().trim().min(1),
  dias: z.number().finite().positive(),
  imagem: z.string().url().optional()
}).strict();

export { CreateMachineSchema };