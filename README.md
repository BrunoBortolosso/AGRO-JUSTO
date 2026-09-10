# AgroJusto

Plataforma voltada ao pequeno produtor rural para **precificação justa**, **cadastro de produtos** e **aluguel colaborativo de máquinas**.

## Problema que o sistema resolve
Pequenos produtores muitas vezes vendem abaixo do custo por falta de referência e por dependerem de intermediários. Além disso, o acesso a máquinas é caro e irregular.

## Objetivo do projeto
Ajudar o produtor a:
- calcular um preço mínimo/ideal baseado em custos e contexto de mercado;
- organizar seus produtos e disponibilidade;
- facilitar o aluguel/compartilhamento de máquinas e ferramentas.

## MVP (essencial)
- **Produtos**: cadastrar e listar produtos agrícolas.
- **Máquinas**: cadastrar e listar máquinas/ferramentas disponíveis para aluguel (iniciado na modelagem do banco).
- **Precificação**: registrar simulações de preço (iniciado no protótipo e preparado para evoluir para backend).

> Observação: nesta AV2 o foco é **estrutura técnica + integração inicial**, não o sistema completo.

## Tecnologias
- **Frontend**: React (JavaScript) + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Banco/ORM**: MySQL ou MariaDB + Prisma ORM
- **Validação**: Zod
- **Testes**: node:test + Supertest
- **Documentação**: OpenAPI 3.1 + Swagger UI

## Estrutura do repositório
- `frontend/`: aplicação React + Tailwind
- `backend/`: API Node/Express + Prisma
- `index.html`, `script.js`, `style.css`: protótipo inicial (AV1) em HTML/JS (mantido para referência)
- `insomnia/`: coleção exportada do Insomnia
- `docs/`: guias rápidos (banco de produção, etc.)

## Como rodar localmente
### Pré-requisitos
- Node.js (recomendado: LTS)
- NPM

### 1) Backend
1. Instalar dependências:
   - `cd backend`
   - `npm install`
2. Configurar variáveis:
   - copiar `backend/.env.example` para `backend/.env`
   - configurar `DATABASE_URL` para o Prisma CLI
   - configurar `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` e `DATABASE_NAME` para o runtime
3. Verificar o estado das migrações:
   - `npx prisma migrate status`
4. Gerar o cliente Prisma depois de confirmar o schema e as migrações:
   - `npm run prisma:generate`
5. Subir a API:
   - `npm run dev`

API padrão: `http://localhost:3333`
Documentação Swagger: `http://localhost:3333/docs`

### Variáveis de ambiente do backend

- `PORT`: porta HTTP, padrão `3333`.
- `DATABASE_URL`: URL MySQL/MariaDB usada pelo Prisma CLI.
- `DATABASE_HOST`: host do banco usado pelo adapter MariaDB.
- `DATABASE_PORT`: porta do banco, normalmente `3306`.
- `DATABASE_USER`: usuário do banco.
- `DATABASE_PASSWORD`: senha do banco.
- `DATABASE_NAME`: nome do banco.
- `CORS_ORIGIN`: origens permitidas separadas por vírgula.

Não commite o arquivo `.env`.

### Testes

Executar os testes com:

```bash
cd backend
npm test
```

Os testes de integração usam `node:test` e `supertest` e devem apontar para um banco de testes isolado quando forem habilitados.

### 2) Frontend
1. Instalar dependências:
   - `cd frontend`
   - `npm install`
2. Configurar API:
   - copiar `frontend/.env.example` para `frontend/.env` (ou ajustar `VITE_API_URL`)
3. Subir o React:
   - `npm run dev`

Frontend padrão: `http://localhost:5173`

## Comunicação inicial (Frontend ↔ Backend)
A tela inicial do React lista e cadastra produtos consumindo as rotas:
- `GET /products`
- `POST /products`

## Banco de dados em produção (AV2)
Para a entrega da AV2 é necessário criar o banco no servidor de produção da turma.
Veja o guia em `docs/PRODUCAO_DB.md`.

## Documentação e Insomnia

- OpenAPI: `docs/openapi.yaml`
- Swagger UI: `GET /docs` (`http://localhost:3333/docs`)
- Coleção: `insomnia/AgroJusto-API.json`

Esses caminhos são relativos à pasta `backend/`. A coleção usa `base_url` e `token` como variáveis de ambiente. Após login, informe o Bearer Token na variável `token`.
