# Banco de dados em produção (AV2)

Este guia é para conectar o Prisma ao banco no **servidor de produção da turma**.

## 1) Criar o banco e tabelas no servidor
1. Acesse o servidor usando as credenciais fornecidas pelo professor.
2. Crie o banco (ex.: `agrojusto`).
3. Garanta que o usuário tenha permissão para criar tabelas.

> O professor pode pedir print/demonstração das tabelas criadas.

## 2) Configurar a `DATABASE_URL`
Edite `backend/.env` e defina a string de conexão do servidor.

Exemplo (PostgreSQL):

`DATABASE_URL="postgresql://USER:SENHA@HOST:5432/NOME_DO_BANCO?schema=public"`

Se o banco for MySQL, será necessário ajustar o `provider` em `backend/prisma/schema.prisma` e usar uma URL MySQL.

## 3) Aplicar o schema do Prisma no banco
Dentro de `backend/`:

- Gerar client:
  - `npm run prisma:generate`

- Criar tabelas:
  - `npx prisma db push`

> Em alguns ambientes `prisma migrate dev` pode exigir shadow database. Para AV2, `db push` já comprova criação das tabelas.

## 4) Verificar
- Abra uma ferramenta de banco (DBeaver/Beekeeper/pgAdmin/etc.) e confira as tabelas do schema.
- Teste `GET /products` e `POST /products` no Insomnia.
