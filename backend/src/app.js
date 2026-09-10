import express from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { costsRouter } from "./routes/costs.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { meRouter } from "./routes/me.js";
import { machinesRouter } from "./routes/machines.js";
import { pricingRouter } from "./routes/pricing.js";
import { productsRouter } from "./routes/products.js";
import { rentalsRouter } from "./routes/rentals.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const openApiDocument = YAML.parse(
  readFileSync(join(currentDirectory, "../docs/openapi.yaml"), "utf8")
);

function isAllowedOrigin(origin) {
  if (!origin) return true;

  const configuredOrigins = String(process.env.CORS_ORIGIN || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredOrigins.includes(origin)) return true;
  if (process.env.NODE_ENV === "production") return false;

  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

function createApp() {
  const app = express();

  app.use(cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
  }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "agrojusto-backend" });
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/auth", authRouter);
  app.use("/me", meRouter);
  app.use("/products", productsRouter);
  app.use("/costs", costsRouter);
  app.use("/pricing", pricingRouter);
  app.use("/machines", machinesRouter);
  app.use("/rentals", rentalsRouter);
  app.use("/dashboard", dashboardRouter);

  app.use(errorHandler);

  return app;
}

export { createApp };
