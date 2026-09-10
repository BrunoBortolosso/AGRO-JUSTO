import { z } from "zod";

const ProductFields = {
  nome: z.string().trim().min(1),
  quantidade: z.number().finite().positive(),
  unidade: z.string().trim().min(1),
  cultivo: z.string().trim().min(1),
  regiao: z.string().trim().min(1),
  preco: z.number().finite().positive(),
  imagem: z.string().url().optional()
};

const CreateProductSchema = z.object(ProductFields).strict();
const UpdateProductSchema = z.object(ProductFields).partial().strict();

export { CreateProductSchema, UpdateProductSchema };