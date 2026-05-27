require("dotenv/config");

const { createApp } = require("./app");

const PORT = Number(process.env.PORT || 3333);

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API rodando em http://localhost:${PORT}`);
});
