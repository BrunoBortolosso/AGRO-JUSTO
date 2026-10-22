import { z } from "zod";

const machineImageSchema = z.union([
  z.string().url(),
  z.string().max(7_000_000).regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i)
]).nullable().optional();

const CreateMachineSchema = z.object({
  nome: z.string().trim().min(1),
  preco: z.number().finite().positive(),
  tipo: z.string().trim().min(1),
  condicoes: z.string().trim().min(1),
  dias: z.number().finite().positive(),
  imagem: machineImageSchema,
  localizacao: z.string().trim().min(1).max(191).nullable().optional(),
  proprietario: z.string().trim().min(1).max(191).nullable().optional(),
  disponibilidade: z.boolean().optional()
}).strict();

const UpdateMachineSchema = CreateMachineSchema.partial().strict();

export { CreateMachineSchema, UpdateMachineSchema };