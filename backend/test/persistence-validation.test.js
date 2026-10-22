import assert from "node:assert/strict";
import test from "node:test";

import { UpdateMeSchema } from "../src/validation/auth.js";
import { CreateMachineSchema, UpdateMachineSchema } from "../src/validation/machines.js";
import { CreateProductSchema, UpdateProductSchema } from "../src/validation/products.js";

const smallPngDataUrl = "data:image/png;base64,aGVsbG8=";

test("profile update accepts bio and an empty region", () => {
  const result = UpdateMeSchema.safeParse({ nome: "Produtora", regiao: "   ", bio: "Cultivo familiar" });
  assert.equal(result.success, true);
  assert.equal(result.data.regiao, null);
});

test("product create/update accepts data URL images and image removal", () => {
  const product = {
    nome: "Milho",
    quantidade: 12,
    unidade: "kg",
    cultivo: "convencional",
    regiao: "Campinas",
    preco: 70,
    imagem: smallPngDataUrl
  };
  assert.equal(CreateProductSchema.safeParse(product).success, true);
  assert.equal(UpdateProductSchema.safeParse({ imagem: null }).success, true);
});

test("machine create/update accepts persisted fields and image removal", () => {
  const machine = {
    nome: "Trator",
    preco: 160,
    tipo: "trator",
    condicoes: "Em bom estado",
    dias: 1,
    imagem: smallPngDataUrl,
    localizacao: "Campinas",
    proprietario: "Produtor"
  };
  assert.equal(CreateMachineSchema.safeParse(machine).success, true);
  assert.equal(UpdateMachineSchema.safeParse({ imagem: null, localizacao: null }).success, true);
});
