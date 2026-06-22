# 📊 Relatório de Análise do Projeto

## 1. 🏗️ Identificação e visão geral

- **Nome do projeto:** AgroJusto
- **Objetivo identificado:** ajudar o pequeno produtor a calcular preço mínimo/ideal, organizar produtos e disponibilidade e facilitar aluguel/compartilhamento de máquinas e ferramentas.
- **Problema que o sistema pretende resolver:** pequenos produtores vendem abaixo do custo por falta de referência, dependem de intermediários e têm acesso caro/irregular a máquinas.
- **Funcionalidades do MVP descritas:**
  - cadastrar e listar produtos agrícolas;
  - cadastrar e listar máquinas/ferramentas disponíveis para aluguel, iniciado na modelagem do banco;
  - registrar simulações de preço, iniciado no protótipo e preparado para evolução ao backend.
- **Tecnologias principais:**
  - React;
  - Vite;
  - Tailwind CSS;
  - Node.js;
  - Express;
  - Prisma ORM;
  - MySQL/MariaDB no código e schema;
  - Insomnia como ferramenta prevista para testes de rotas.
- **Linguagens utilizadas:**
  - JavaScript;
  - HTML;
  - CSS;
  - Prisma Schema;
  - SQL.

### Evidências consultadas

- `README.md` — identifica o nome AgroJusto, problema, objetivo, MVP, tecnologias, estrutura e instruções de execução.
- `backend/package.json` — identifica Node.js, Express, Prisma, CORS, dotenv e adaptador MariaDB.
- `backend/prisma/schema.prisma` — define datasource `mysql`, models do domínio e relações.
- `backend/src/app.js` — configura Express, CORS, JSON, healthcheck e rota `/products`.
- `frontend/package.json` — identifica React, Vite e Tailwind.
- `frontend/src/App.jsx` — tela React com listagem e cadastro de produtos via `fetch`.
- `index.html`, `script.js`, `style.css` — protótipo legado com telas de precificação, produtos, máquinas e painel.
- `insomnia/README.md` — documenta rotas esperadas e informa que o arquivo exportado do Insomnia não foi gerado.

## 2. 📂 Organização do repositório

```text
AGRO-JUSTO/
├── README.md
├── .gitignore
├── index.html
├── script.js
├── style.css
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── prisma.config.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │       └── 20260608120953_init/
│   │           └── migration.sql
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── db/prisma.js
│       └── routes/products.js
├── frontend/
│   ├── package.json
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── assets/
├── insomnia/
│   └── README.md
└── docs/
    └── PRODUCAO_DB.md
```

### Responsabilidade das pastas

- `backend/` — API Node.js/Express, configuração Prisma, schema e migrations.
- `backend/src/routes/` — rotas HTTP da API, com implementação de produtos.
- `backend/src/db/` — instanciação do Prisma Client com adaptador MariaDB.
- `backend/prisma/` — schema Prisma e migrations SQL.
- `frontend/` — aplicação React/Vite com Tailwind.
- `frontend/src/` — entrada da aplicação e componente principal.
- `insomnia/` — documentação para criação/exportação da coleção do Insomnia.
- `docs/` — documentação auxiliar sobre banco em produção.
- raiz (`index.html`, `script.js`, `style.css`) — protótipo inicial em HTML, CSS e JavaScript.

### Análise da organização

- Separação entre frontend e backend: adequada, com pastas `frontend/` e `backend/` separadas.
- Nomes de pastas e arquivos: claros para a maior parte da estrutura; o protótipo legado permanece na raiz e está documentado no README.
- Arquivos de configuração: existem configurações para Vite, Tailwind, PostCSS, Prisma, ambiente de exemplo e `.gitignore`.
- Organização mínima do projeto: atende parcialmente bem; há início de camadas, mas o backend usa apenas rotas e não possui controllers/services separados.

## 3. 📘 README e documentação inicial

**Localização:** `README.md`

| Item esperado | Situação | Evidência |
|---|---|---|
| Nome do projeto | Atende | `README.md` — título `AgroJusto` |
| Problema que o sistema resolve | Atende | `README.md` — seção “Problema que o sistema resolve” |
| Objetivo do projeto | Atende | `README.md` — seção “Objetivo do projeto” |
| Funcionalidades do MVP | Atende | `README.md` — seção “MVP (essencial)” |
| Tecnologias utilizadas | Atende | `README.md` — seção “Tecnologias” |
| Instruções para execução local | Atende | `README.md` — seção “Como rodar localmente” |
| Divisão entre frontend, backend e banco | Atende | `README.md` — seções “Estrutura do repositório”, “Backend”, “Frontend” e “Banco de dados em produção” |

### Histórico de commits e participação

- Histórico disponível para análise: Sim.
- Participação dos integrantes identificável: Parcial.
- Evidências: `git log` local mostra commits de `hfcosta`, `BrunoBortolosso` e `EA - Bruno Bortolosso`. O histórico indica mais de um autor textual, mas não comprova divisão detalhada de tarefas nem participação efetiva de cada integrante.

> Não foi atribuída autoria individual de funcionalidades, pois o histórico local não é suficiente para comprovar isso com segurança.

### Professor como colaborador

**Situação:** NÃO VERIFICÁVEL PELO REPOSITÓRIO

## 4. ⚙️ Backend

- **Localização:** `backend/`
- **Linguagem:** JavaScript
- **Framework principal:** Express
- **Arquivo de inicialização:** `backend/src/server.js`
- **Servidor configurado:** Sim

### Estrutura identificada

- `backend/src/server.js` — carrega variáveis de ambiente, conecta o Prisma e inicia o servidor.
- `backend/src/app.js` — cria app Express, habilita CORS/JSON, define `/health` e registra `/products`.
- `backend/src/routes/products.js` — implementa rotas CRUD de produtos.
- `backend/src/db/prisma.js` — configura Prisma Client com `@prisma/adapter-mariadb`.
- `backend/prisma/schema.prisma` — modelagem do banco.

### Organização interna

- Rotas: presentes em `backend/src/routes/products.js`.
- Controllers: NÃO IDENTIFICADO; a lógica está diretamente no arquivo de rotas.
- Services: NÃO IDENTIFICADO.
- Middlewares: presentes parcialmente via `cors()`, `express.json()` e middleware global de erro em `backend/src/app.js`.
- Configuração do banco: presente em `backend/src/db/prisma.js`, `backend/prisma/schema.prisma` e `backend/prisma.config.ts`.
- Validações: parciais em `backend/src/routes/products.js`, com validação de `nome`, `unidade` e `id`.
- Tratamento de erros: parcial, com middleware genérico e tratamento de `P2025` nas rotas de update/delete.

### Funcionalidades implementadas

- Healthcheck da API — Evidência: `backend/src/app.js`.
- Listagem de produtos via `GET /products` — Evidência: `backend/src/routes/products.js`.
- Cadastro de produtos via `POST /products` — Evidência: `backend/src/routes/products.js`.
- Atualização de produtos via `PATCH /products/:id` — Evidência: `backend/src/routes/products.js`.
- Exclusão de produtos via `DELETE /products/:id` — Evidência: `backend/src/routes/products.js`.

### Fluxo das requisições

```text
requisição → rota Express → função no arquivo de rotas → Prisma → banco de dados → resposta JSON
```

O fluxo existe no código para `/products`, mas há uma interrupção provável na compatibilidade com o model Prisma atual: `backend/src/routes/products.js` usa `prisma.product` e campos `nome`, `quantidade`, `unidade`, `preco`, enquanto `backend/prisma/schema.prisma` define o model `Produto` com campos `usuarioId`, `nome`, `quantidade`, `unidadeMedida`, `tipoCultivo`, `regiao`, `descricao` e não define `preco` nem `unidade`. Além disso, `usuarioId` é obrigatório. Portanto, a intenção de fluxo está implementada, mas a operação real contra o schema versionado não fica comprovada como funcional.

## 5. 🗄️ Banco de dados e Prisma ORM

- **Tipo de banco:** MySQL/MariaDB identificado no código e no schema. O README cita PostgreSQL, mas o schema Prisma, migration lock, migration SQL e adaptador do backend indicam MySQL/MariaDB.
- **ORM:** Prisma
- **Configuração principal:** `backend/src/db/prisma.js`, `backend/prisma.config.ts`
- **Schema Prisma:** `backend/prisma/schema.prisma`
- **Migrations:** Sim
- **Localização das migrations:** `backend/prisma/migrations/20260608120953_init/migration.sql`

### Models ou entidades identificadas

- `Usuario` — usuário produtor/comprador, com `id`, `nome`, `email`, `senha`, `tipoUsuario`, telefone, data de cadastro e relações com produtos, equipamentos e aluguéis.
- `Produto` — produto agrícola, com vínculo obrigatório a usuário, quantidade, unidade de medida, tipo de cultivo, região, descrição, custos e preços justos.
- `Custo` — custo associado a produto, com tipo, descrição, valor, quantidade/unidade de insumo e datas.
- `PrecoJusto` — simulação/cálculo de preço, com custo total, margem, preço mínimo, preço ideal, quantidade produzida e moeda.
- `Equipamento` — máquina/ferramenta para aluguel, com usuário dono, tipo, valor por dia e disponibilidade.
- `Aluguel` — contrato de aluguel, com equipamento, locador, locatário, datas, valores, status e observações.

### Modelagem

| Elemento | Situação | Evidência |
|---|---|---|
| Models principais definidos | Atende | `backend/prisma/schema.prisma` |
| Chaves primárias | Atende | `@id @default(uuid())` nos models |
| Chaves estrangeiras e relações | Atende | relações `@relation` e migration SQL com `ALTER TABLE ... FOREIGN KEY` |
| Campos coerentes com o domínio | Atende | models `Produto`, `Custo`, `PrecoJusto`, `Equipamento`, `Aluguel` |
| Prisma Client utilizado no backend | Parcial | `backend/src/db/prisma.js` e `backend/src/routes/products.js`; há incompatibilidade provável entre nomes/campos usados na rota e schema |
| Operação real de banco em rota/controller | Parcial | `findMany`, `create`, `update`, `delete` em `backend/src/routes/products.js`, mas com campos não alinhados ao schema |

### Operações Prisma encontradas

- `findMany`, `findUnique` ou equivalente: `findMany` em `backend/src/routes/products.js`.
- `create`: `backend/src/routes/products.js`.
- `update`: `backend/src/routes/products.js`.
- `delete`: `backend/src/routes/products.js`.
- Outras operações: `$connect` em `backend/src/server.js`.

### Banco no servidor de produção

A existência de arquivos de configuração e documentação indica preparação para conexão, mas não comprova criação efetiva do banco no servidor.

**Situação:** NÃO VERIFICÁVEL PELO REPOSITÓRIO

## 6. 🌐 Rotas da API e arquivo do Insomnia

### Rotas encontradas no backend

| Método | Endpoint | Arquivo | Operação realizada | Usa Prisma |
|---|---|---|---|---|
| GET | `/health` | `backend/src/app.js` | retorna status `{ ok: true, service: "agrojusto-backend" }` | Não |
| GET | `/products` | `backend/src/routes/products.js` | lista produtos ordenados por criação | Sim |
| POST | `/products` | `backend/src/routes/products.js` | cria produto com dados recebidos em JSON | Sim |
| PATCH | `/products/:id` | `backend/src/routes/products.js` | atualiza produto por id | Sim |
| DELETE | `/products/:id` | `backend/src/routes/products.js` | exclui produto por id | Sim |

### Adequação das rotas

- Uso adequado dos métodos HTTP: adequado para healthcheck, listagem, criação, atualização parcial e exclusão.
- Organização por funcionalidade: parcial, pois há apenas `products.js`; demais funcionalidades do MVP não possuem rotas.
- Clareza dos nomes: clara para `/health` e `/products`.
- Existência de parâmetros: presente em `PATCH /products/:id` e `DELETE /products/:id`.
- Recebimento de JSON: configurado em `backend/src/app.js` via `express.json()`.
- Respostas em JSON: presentes em `/health`, `GET /products`, `POST /products`, `PATCH /products/:id` e erros tratados; `DELETE` responde 204 sem corpo, adequado ao método.
- Relação com o MVP: cobre parcialmente produtos; máquinas e precificação não possuem rotas implementadas.

### Arquivo exportado do Insomnia

- **Arquivo encontrado:** NÃO IDENTIFICADO
- **Formato:** NÃO IDENTIFICADO
- **Rotas organizadas por funcionalidade:** Não
- **Nomes claros nas requisições:** NÃO IDENTIFICADO
- **Exemplos de corpo JSON:** Parcial, apenas documentados em `insomnia/README.md`, não em exportação do Insomnia.
- **Parâmetros e variáveis configurados:** Não
- **Compatibilidade com as rotas do backend:** Parcial no README, mas não comprovada por arquivo exportado.

Não há entrega completa do arquivo exportado. `insomnia/README.md` informa explicitamente que o arquivo exportado não foi gerado automaticamente e orienta salvar `insomnia/AgroJusto_AV2.json`.

## 7. 🎨 Frontend

- **Localização:** `frontend/`
- **Framework:** React
- **Linguagem:** JavaScript
- **Ferramenta de criação/build:** Vite
- **Tailwind CSS:** Configurado e utilizado
- **Roteamento:** NÃO IDENTIFICADO

### Arquivos principais

- `frontend/src/main.jsx` — renderiza o componente `App`.
- `frontend/src/App.jsx` — tela principal com cadastro e listagem de produtos.
- `frontend/src/index.css` — importa diretivas Tailwind e estilos globais; contém também trechos residuais/malformados.
- `frontend/tailwind.config.js` — configura conteúdo Tailwind para `index.html` e arquivos `js/jsx`.
- `frontend/postcss.config.js` — configura Tailwind e Autoprefixer.
- `frontend/.env.example` — define `VITE_API_URL`.

### Páginas e componentes

- `App` em `frontend/src/App.jsx` — componente único com formulário de cadastro, listagem de produtos, botão de recarregar e exibição da API atual.
- Protótipo legado em `index.html`/`script.js` — telas de login simulado, precificação, produtos, máquinas e painel usando JavaScript e localStorage, fora do app React.

### Análise do desenvolvimento inicial

| Elemento | Situação | Evidência |
|---|---|---|
| Projeto React iniciado | Atende | `frontend/package.json`, `frontend/src/main.jsx`, `frontend/src/App.jsx` |
| Uso de JavaScript | Atende | arquivos `.jsx` e configuração Vite sem TypeScript |
| Tailwind configurado ou utilizado | Atende | `frontend/tailwind.config.js`, `frontend/postcss.config.js`, classes Tailwind em `frontend/src/App.jsx` |
| Telas principais iniciadas | Parcial | tela React cobre produtos; protótipo legado cobre mais telas fora do React |
| Componentes organizados | Parcial | há um componente principal; não há decomposição em componentes/páginas |
| Navegação entre páginas | Não atende | não há React Router ou navegação entre páginas no frontend React |
| Tela conectada ou preparada para API | Parcial | `frontend/src/App.jsx` usa `fetch` para `/products`, mas os dados enviados/esperados não estão alinhados ao schema Prisma atual |

## 8. 🔗 Conexão entre frontend e backend

- **Tipo de comunicação:** REST
- **Cliente HTTP:** Fetch
- **Arquivo de configuração da API:** `frontend/src/App.jsx` e `frontend/.env.example`
- **URL base:** `http://localhost:3333` em `frontend/src/App.jsx`; `VITE_API_URL=http://localhost:3333` em `frontend/.env.example`
- **Variáveis de ambiente:** `frontend/.env.example`, `backend/.env.example`
- **CORS no backend:** Configurado em `backend/src/app.js`
- **Proxy no frontend:** Ausente

### Endpoints consumidos pelo frontend

| Endpoint | Método | Componente ou página | Finalidade | Compatível com o backend |
|---|---|---|---|---|
| `/products` | GET | `frontend/src/App.jsx` | carregar lista de produtos | Parcial |
| `/products` | POST | `frontend/src/App.jsx` | cadastrar produto | Parcial |

### Fluxos comprovados

- A tela React chama `GET /products` e tenta listar os dados retornados.
- O formulário React envia `POST /products` com `nome`, `quantidade`, `unidade` e `preco`.

### Estado da integração

**Classificação:** Parcial.

Há comunicação identificável entre frontend e backend via `fetch` e rotas `/products`, e o backend habilita CORS e JSON. Porém, a compatibilidade completa não é comprovada porque o schema Prisma versionado exige campos diferentes dos usados pela rota e pelo frontend. O frontend usa `unidade` e `preco`; o schema define `unidadeMedida`, `tipoCultivo`, `usuarioId` obrigatório e não define `preco` em `Produto`.

## 9. ✅ O que já está implementado

### Backend

- Servidor Express com `cors`, `express.json`, healthcheck e middleware de erro.
- Rotas CRUD de produtos no arquivo `backend/src/routes/products.js`.
- Conexão inicial do servidor com Prisma via `$connect`.

### Banco de dados

- Schema Prisma com models do domínio AgroJusto.
- Migration SQL inicial com tabelas, chaves primárias e chaves estrangeiras.
- Configuração Prisma com migrations e client customizado.

### Frontend

- Projeto React/Vite iniciado em JavaScript.
- Tailwind configurado e utilizado no componente principal.
- Tela React para cadastro e listagem de produtos.
- Protótipo legado com telas de precificação, produtos, máquinas e painel usando localStorage.

### Integração

- Frontend chama rotas REST `/products` via `fetch`.
- Backend expõe rotas REST de produtos e habilita CORS.

## 10. 🚧 O que está incompleto ou em desenvolvimento

- Arquivo exportado do Insomnia ausente.
  - **Evidência:** `insomnia/README.md`
  - **Estado observado:** existe apenas documentação de como exportar; não há JSON/YAML exportado da coleção.

- Rotas de máquinas/equipamentos ausentes no backend.
  - **Evidência:** `backend/src/routes/products.js`, `backend/src/app.js`
  - **Estado observado:** somente `/products` e `/health` são registrados.

- Rotas de precificação ausentes no backend.
  - **Evidência:** `backend/src/routes/products.js`, `backend/src/app.js`
  - **Estado observado:** model `PrecoJusto` existe no schema, mas não há endpoint para simulações de preço.

- Integração de produtos com Prisma não alinhada ao schema atual.
  - **Evidência:** `backend/src/routes/products.js`, `backend/prisma/schema.prisma`
  - **Estado observado:** a rota usa campos e nome de client que não correspondem claramente ao model `Produto` versionado.

- Frontend React concentrado em um único componente.
  - **Evidência:** `frontend/src/App.jsx`
  - **Estado observado:** não há organização em páginas/componentes nem roteamento.

- CSS do frontend React com trechos residuais/malformados.
  - **Evidência:** `frontend/src/index.css`
  - **Estado observado:** após diretivas Tailwind e estilos globais há blocos soltos de CSS que parecem sobras de template.

- Banco de produção não comprovado pelo repositório.
  - **Evidência:** `docs/PRODUCAO_DB.md`
  - **Estado observado:** há orientação para criação/verificação, mas não evidência de banco criado em servidor.

## 11. 📦 Dependências principais

### Backend

| Dependência | Versão | Finalidade identificada |
|---|---:|---|
| `express` | `^5.2.1` | servidor HTTP e rotas |
| `cors` | `^2.8.6` | liberação de CORS para integração frontend-backend |
| `dotenv` | `^17.4.2` | carregamento de variáveis de ambiente |
| `@prisma/client` | `^7.8.0` | Prisma Client |
| `@prisma/adapter-mariadb` | `^7.8.0` | adaptador MariaDB para Prisma |
| `prisma` | `^7.8.0` | CLI/configuração Prisma em desenvolvimento |
| `nodemon` | `^3.1.14` | execução em desenvolvimento com reload |

### Frontend

| Dependência | Versão | Finalidade identificada |
|---|---:|---|
| `react` | `^19.2.6` | framework de interface |
| `react-dom` | `^19.2.6` | renderização React no navegador |
| `vite` | `^8.0.12` | ferramenta de desenvolvimento/build |
| `@vitejs/plugin-react` | `^6.0.1` | plugin React para Vite |
| `tailwindcss` | `^3.4.17` | utilitários CSS |
| `postcss` | `^8.5.15` | processamento CSS |
| `autoprefixer` | `^10.5.0` | prefixos CSS |
| `eslint` | `^10.3.0` | lint |
| `eslint-plugin-react-hooks` | `^7.1.1` | regras para hooks React |
| `eslint-plugin-react-refresh` | `^0.5.2` | regras para React Refresh |
| `globals` | `^17.6.0` | globais para configuração ESLint |
| `@eslint/js` | `^10.0.1` | configuração base ESLint |
| `@types/react` | `^19.2.14` | tipos auxiliares instalados mesmo com JavaScript |
| `@types/react-dom` | `^19.2.3` | tipos auxiliares instalados mesmo com JavaScript |

## 12. 🧭 Arquitetura e padrões identificados

- **Arquitetura predominante:** estrutura simples em camadas iniciais, com separação por frontend/backend e rota direta no backend.
- **Separação de responsabilidades:** parcial. O repositório separa frontend, backend, banco e documentação, mas no backend a lógica de validação, chamada Prisma e resposta HTTP está no mesmo arquivo de rotas.
- **Padrões identificados:** app factory em `createApp`, arquivo separado para inicialização do servidor, arquivo separado para Prisma, rotas Express por funcionalidade, React com estado local e chamadas `fetch`.
- **Consistência entre os módulos:** parcial. A documentação, frontend e backend convergem na funcionalidade de produtos, mas há divergências entre README e schema sobre o banco, e entre rota/frontend e schema sobre campos de produto.

# 13. 📝 Avaliação conforme os critérios da AV2

## Regras de pontuação

A pontuação abaixo considera apenas evidências disponíveis no repositório. Itens que dependem de apresentação, GitHub remoto, banco de produção ou colaboração externa são marcados como não verificáveis quando aplicável.

## Quadro avaliativo

| Critério | Valor máximo | Nota atribuída | Evidências e justificativa |
|---|---:|---:|---|
| Organização do repositório, README e professor como colaborador | 1,5 | 1,2 | Estrutura separada em `frontend/`, `backend/`, `docs/` e `insomnia/`; README completo. Professor como colaborador é NÃO VERIFICÁVEL PELO REPOSITÓRIO. Há divergência documental sobre banco PostgreSQL versus schema MySQL/MariaDB. |
| Banco de dados criado e coerente com o MVP | 2,0 | 1,6 | `schema.prisma` e migration definem usuários, produtos, custos, preços, equipamentos e aluguéis com relações. Coerente com o MVP, mas criação em servidor de produção é NÃO VERIFICÁVEL PELO REPOSITÓRIO e há desalinhamento com a rota de produtos. |
| Arquivo exportado do Insomnia com as rotas organizadas | 1,5 | 0,3 | `insomnia/README.md` documenta rotas e exemplos, mas o arquivo exportado do Insomnia não foi encontrado. |
| Backend iniciado com integração ao banco usando Prisma ORM | 2,0 | 1,2 | Express, CORS, JSON, Prisma Client e rotas CRUD existem. A integração é parcial porque as operações de produtos parecem incompatíveis com o schema Prisma versionado. |
| Frontend iniciado em React, JavaScript e Tailwind | 1,5 | 1,2 | React/Vite em JavaScript e Tailwind configurado/utilizado. Há tela inicial de produtos, mas sem organização em componentes/páginas e com CSS residual em `index.css`. |
| Conexão inicial entre frontend e backend | 1,0 | 0,6 | `frontend/src/App.jsx` consome `/products` por `fetch`, e backend expõe `/products`; compatibilidade é parcial por divergência de campos/schema. |
| Clareza na apresentação e divisão de tarefas do grupo | 0,5 | NÃO VERIFICÁVEL | Histórico local mostra autores de commits, mas não comprova divisão de tarefas nem apresentação. |
| **Total verificável no repositório** | **10,0** | **6,1** | Soma dos critérios com nota numérica verificável; o item de apresentação/divisão de tarefas permanece a definir externamente. |

### Observação sobre o total

- **Pontuação obtida nos itens verificáveis:** 6,1
- **Pontos dependentes de apresentação ou verificação externa:** 0,5 diretamente; professor como colaborador e banco de produção também dependem de verificação externa dentro de critérios maiores.
- **Nota máxima que pode ser confirmada apenas pelo repositório:** 9,5, pois 0,5 de apresentação/divisão de tarefas não é verificável somente pelos arquivos.

Não se transforma automaticamente o item não verificável em zero; a decisão final depende da apresentação ou de verificação externa pelo professor.

## 14. 📌 Síntese por critério

### 14.1 Organização do repositório e README — máximo 1,5

- **Situação:** Atende parcialmente.
- **Evidências:** `README.md`, `.gitignore`, `frontend/`, `backend/`, `docs/`, `insomnia/`.
- **Aspectos comprovados:** separação clara entre frontend e backend, documentação inicial completa, instruções locais e descrição do MVP.
- **Aspectos ausentes:** não há comprovação no repositório de professor como colaborador; há divergência de banco entre README e arquivos técnicos.
- **Aspectos não verificáveis:** professor como colaborador.
- **Nota sugerida:** 1,2/1,5

### 14.2 Banco de dados e coerência com o MVP — máximo 2,0

- **Situação:** Atende parcialmente.
- **Evidências:** `backend/prisma/schema.prisma`, `backend/prisma/migrations/20260608120953_init/migration.sql`, `backend/prisma/migrations/migration_lock.toml`.
- **Models/tabelas principais:** usuários, produtos, custos, preços justos, equipamentos e aluguéis.
- **Coerência com o MVP:** boa na modelagem, pois cobre produtos, máquinas e precificação; implementação de rotas cobre apenas produtos.
- **Criação no servidor de produção:** Não verificável.
- **Nota sugerida:** 1,6/2,0

### 14.3 Insomnia e organização das rotas — máximo 1,5

- **Situação:** Não atende como entrega completa.
- **Evidências:** `insomnia/README.md`; ausência de arquivo exportado em `insomnia/`.
- **Organização das requisições:** apenas sugerida na documentação.
- **Compatibilidade com o backend:** parcialmente documentada, mas não comprovada em arquivo exportado.
- **Nota sugerida:** 0,3/1,5

### 14.4 Backend com Prisma ORM — máximo 2,0

- **Situação:** Parcial.
- **Evidências:** `backend/src/app.js`, `backend/src/server.js`, `backend/src/db/prisma.js`, `backend/src/routes/products.js`, `backend/prisma/schema.prisma`.
- **Servidor Node.js/Express:** configurado.
- **Prisma configurado:** configurado com client e adaptador MariaDB.
- **Operação no banco:** operações Prisma existem em produtos, mas há incompatibilidade provável com o schema.
- **Resposta em JSON:** presente nas rotas GET/POST/PATCH e erros.
- **Nota sugerida:** 1,2/2,0

### 14.5 Frontend com React, JavaScript e Tailwind — máximo 1,5

- **Situação:** Atende parcialmente.
- **Evidências:** `frontend/package.json`, `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`.
- **React iniciado:** sim.
- **JavaScript:** sim, com `.jsx`.
- **Tailwind:** configurado e usado.
- **Telas e componentes:** tela de produtos iniciada; sem decomposição ou múltiplas páginas no React.
- **Nota sugerida:** 1,2/1,5

### 14.6 Conexão frontend-backend — máximo 1,0

- **Situação:** Parcial.
- **Evidências:** `frontend/src/App.jsx`, `frontend/.env.example`, `backend/src/app.js`, `backend/src/routes/products.js`.
- **Fluxo identificado:** frontend chama `GET /products` e `POST /products`; backend registra essas rotas.
- **Compatibilidade das rotas e dados:** parcial, por divergência entre campos usados e schema Prisma.
- **Nota sugerida:** 0,6/1,0

### 14.7 Apresentação e divisão de tarefas — máximo 0,5

- **Situação:** Não verificável.
- **Evidências no repositório:** histórico Git local com três commits e autores textuais; documentação não detalha divisão de tarefas.
- **O que precisa ser verificado na apresentação:** participação efetiva dos integrantes, divisão de responsabilidades e demonstração oral.
- **Nota sugerida:** A DEFINIR/0,5

## 15. 🔍 Pontos para verificação durante a apresentação

- Demonstrar `GET /products` funcionando com o banco configurado.
- Demonstrar `POST /products` com o schema Prisma atual e explicar a compatibilidade dos campos enviados.
- Confirmar qual banco foi usado na entrega: MySQL/MariaDB ou PostgreSQL.
- Mostrar as tabelas criadas no banco de produção da turma.
- Apresentar o arquivo exportado do Insomnia, caso tenha sido produzido fora do repositório.
- Demonstrar o frontend React consumindo a API em execução.
- Explicar o estado das funcionalidades de máquinas e precificação em relação ao backend.
- Indicar a divisão de tarefas entre os integrantes com evidências de participação.
- Confirmar se o professor foi adicionado como colaborador no repositório remoto.

## 16. 📋 Conclusão

O projeto apresenta uma estrutura inicial consistente para a AV2, com separação entre frontend e backend, README completo, schema Prisma bem modelado para o domínio e uma API Express iniciada. O frontend React/Vite com Tailwind também foi iniciado e contém uma tela de produtos com chamadas REST para o backend.

As partes comprovadamente iniciadas são: documentação do projeto, modelagem do banco, migration inicial, servidor Express, rotas de produtos, configuração Prisma, app React e tentativa de integração frontend-backend. O protótipo legado na raiz cobre visualmente precificação, produtos, máquinas e painel, mas usa localStorage e não comprova integração com o backend.

Os principais pontos incompletos são a ausência do arquivo exportado do Insomnia, ausência de rotas backend para máquinas e precificação, falta de comprovação do banco em produção e incompatibilidade provável entre as rotas de produtos e o schema Prisma versionado. Também não é possível verificar pelo repositório a apresentação, a divisão real de tarefas e o professor como colaborador.

Com base apenas nas evidências disponíveis no repositório, a nota sugerida para os itens verificáveis é **6,1/10,0**, com **0,5 ponto a definir** por apresentação/divisão de tarefas e outros aspectos dependentes de verificação externa dentro dos critérios correspondentes.
