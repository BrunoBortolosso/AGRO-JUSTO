import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";

import { createApp } from "../src/app.js";

const app = createApp();

test("GET /health retorna o status esperado", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    ok: true,
    service: "agrojusto-backend"
  });
});
