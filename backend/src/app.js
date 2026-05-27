const express = require("express");
const cors = require("cors");

const { productsRouter } = require("./routes/products");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "agrojusto-backend" });
  });

  app.use("/products", productsRouter);

  app.use((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  });

  return app;
}

module.exports = { createApp };
