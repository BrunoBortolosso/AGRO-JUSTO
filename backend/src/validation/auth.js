import { z } from "zod";

const email = z.string().trim().email().transform((value) => value.toLowerCase());
const password = z.string().min(8);

const RegisterSchema = z.object({
  nome: z.string().trim().min(1),
  email,
  senha: password,
  regiao: z.string().trim().min(1).optional()
}).strict();

const LoginSchema = z.object({
  email,
  senha: password
}).strict();

const UpdateMeSchema = z.object({
  nome: z.string().trim().min(1).optional(),
  regiao: z.string().trim().min(1).nullable().optional()
}).strict();

export { RegisterSchema, LoginSchema, UpdateMeSchema };