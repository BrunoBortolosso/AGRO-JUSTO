import { z } from "zod";

const machineImageSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(
    z.union([
      z.string().url(),
      z.string().regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i)
    ])
  )
  .optional();

const CreateMachineSchema = z.object({
  nome: z.string().trim().min(1),
  preco: z.number().finite().positive(),
  tipo: z.string().trim().min(1),
  condicoes: z.string().trim().min(1),
  dias: z.number().finite().positive(),
  imagem: machineImageSchema
}).strict();

const UpdateMachineSchema = CreateMachineSchema.partial().strict();

export { CreateMachineSchema, UpdateMachineSchema };