import { z } from "zod";

const ProductFields = {
  nome: z.string().trim().min(1),
  descricao: z.string().trim().max(2000).nullable().optional(),
  quantidade: z.number().finite().positive(),
  unidade: z.string().trim().min(1),
  cultivo: z.string().trim().min(1),
  regiao: z.string().trim().min(1),
  preco: z.number().finite().positive(),
  imagem: z.union([
    z.string().url(),
    z.string().max(7_000_000).regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i)
  ]).nullable().optional()
};

const CreateProductSchema = z.object(ProductFields).strict();
const UpdateProductSchema = z.object(ProductFields).partial().strict();

export { CreateProductSchema, UpdateProductSchema };