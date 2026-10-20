import assert from "node:assert/strict";
import test from "node:test";

import { inclusiveDays, rentalOverlapFilter } from "../src/services/rentals.js";
import { CreateRentalSchema } from "../src/validation/rentals.js";

const date = (value) => new Date(`${value}T00:00:00.000Z`);

test("conta as datas inicial e final como diárias", () => {
  assert.equal(inclusiveDays(date("2030-04-10"), date("2030-04-10")), 1);
  assert.equal(inclusiveDays(date("2030-04-10"), date("2030-04-12")), 3);
});

test("consulta conflitos em intervalos que se sobrepõem, incluindo os limites", () => {
  const start = date("2030-04-10");
  const end = date("2030-04-12");

  assert.deepEqual(rentalOverlapFilter("machine-1", start, end), {
    machineId: "machine-1",
    status: "ATIVO",
    finalizadoEm: null,
    start: { lte: end },
    end: { gte: start }
  });
});

test("valida o período futuro e rejeita data final anterior", () => {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const start = tomorrow.toISOString().slice(0, 10);
  const nextDay = new Date(tomorrow);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const end = nextDay.toISOString().slice(0, 10);

  assert.equal(CreateRentalSchema.safeParse({ machineId: "machine-1", start, end }).success, true);
  assert.equal(CreateRentalSchema.safeParse({ machineId: "machine-1", start: end, end: start }).success, false);
});
