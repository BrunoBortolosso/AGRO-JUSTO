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
- **Banco/ORM**: PostgreSQL + Prisma ORM
- **Testes de rotas**: Insomnia

## Estrutura do repositório
- `frontend/`: aplicação React + Tailwind
- `backend/`: API Node/Express + Prisma
- `index.html`, `script.js`, `style.css`: protótipo inicial (AV1) em HTML/JS (mantido para referência)
- `insomnia/`: orientações para organizar e exportar o arquivo do Insomnia
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
   - ajustar `DATABASE_URL`
3. Criar tabelas (dev):
   - `npm run prisma:generate`
   - `npx prisma db push`
4. Subir a API:
   - `npm run dev`

API padrão: `http://localhost:3333`

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

## Rotas no Insomnia (AV2)
As rotas devem ser organizadas por funcionalidade e exportadas.
Veja `insomnia/README.md` para o passo a passo e a organização sugerida.
