import "dotenv/config";

import { createApp } from "./app.js";
import { prisma } from "./db/prisma.js";

const PORT = Number(process.env.PORT || 3333);

const app = createApp();

// Conectar ao banco de dados e iniciar o servidor
prisma
  .$connect()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("✓ Backend conectado com o banco de dados");

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("✗ Erro ao conectar com o banco de dados:", error);
    process.exit(1);
  });
