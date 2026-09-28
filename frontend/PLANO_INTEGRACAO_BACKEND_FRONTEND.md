# Plano de integração Frontend–Backend — MVP AgroJusto

## Resumo

Integrar autenticação e produtos do React com a API Express. Os demais módulos continuarão locais nesta etapa, identificados visualmente como não sincronizados.

Critérios de conclusão:

- Cadastro, login, restauração da sessão e logout usam a API.
- Produtos são carregados e persistidos exclusivamente no banco.
- Nenhuma senha ou usuário fica no `localStorage`.
- Build, lint e testes passam.
- Frontend e backend funcionam juntos em `localhost:5173` e `localhost:3333`.

## Implementação

### 1. Cliente HTTP e sessão

- Criar um cliente HTTP central usando `VITE_API_URL`, com JSON, Bearer Token, suporte a respostas `204` e normalização dos erros `{ error, code, details }`.
- Armazenar somente o token em `sessionStorage`, usando a chave `agrojusto.token`.
- Ao iniciar a aplicação:
  1. Ler o token.
  2. Consultar `GET /me`.
  3. Restaurar o usuário se a sessão for válida.
  4. Remover o token e abrir o login em respostas `401`.
- Centralizar o tratamento de `401` para encerrar a sessão sem manter estado autenticado inválido.
- Representar autenticação com estados explícitos: `checking`, `authenticated` e `anonymous`, mostrando carregamento durante a validação inicial.
- Não criar proxy no Vite; usar a URL configurável para desenvolvimento e produção.

### 2. Autenticação real

- Substituir a busca local de usuários por:
  - `POST /auth/register` com `{ nome, email, senha }`;
  - `POST /auth/login` com `{ email, senha }`;
  - `POST /auth/logout` com Bearer Token.
- Cadastro bem-sucedido deve aproveitar `{ token, user }` e autenticar imediatamente.
- Logout deve tentar revogar a sessão no backend e sempre limpar token e estado local, mesmo se a API estiver indisponível.
- Ajustar validação visual para senha mínima de oito caracteres e confirmação somente no frontend.
- Remover usuário padrão, lista local de usuários e botão de login demonstrativo.
- O cabeçalho deve exibir o usuário retornado pela API, sem depender do perfil local.

### 3. Produtos conectados à API

- Depois da autenticação, carregar produtos com `GET /products`; não usar produtos demonstrativos como fallback.
- Implementar:
  - criação por `POST /products`;
  - edição por `PATCH /products/:id`;
  - exclusão por `DELETE /products/:id`.
- Usar IDs e objetos retornados pelo servidor, sem `crypto.randomUUID()`.
- Enviar apenas os campos aceitos pela API: `nome`, `quantidade`, `unidade`, `cultivo`, `regiao` e `preco`.
- Remover do formulário os campos sem suporte no contrato: `categoria`, `organico` e upload de imagem.
- Exibir o placeholder existente em todos os produtos nesta etapa e omitir `imagem` das requisições.
- Exigir quantidade e preço maiores que zero e região/cultivo preenchidos.
- Executar mutações de maneira pessimista: desabilitar a ação durante a requisição e alterar a lista somente após sucesso.
- Confirmar exclusão, preservar o formulário se uma operação falhar e apresentar mensagens da API em português.
- Separar os estados de carregamento inicial, salvamento e exclusão, incluindo lista vazia e opção de tentar novamente.

### 4. Estado local e módulos adiados

- Na primeira execução da versão integrada, remover `agrojusto.auth`, `agrojusto.users` e `agrojusto.products`; registrar a limpeza com `agrojusto.integrationVersion = 1`.
- Manter custos, precificação, máquinas, aluguéis e perfil nas chaves atuais do `localStorage`.
- Manter essas abas funcionando localmente, mas mostrar aviso persistente: “Dados armazenados somente neste navegador; integração pendente”.
- O dashboard poderá combinar produtos reais com dados locais, devendo mostrar o mesmo aviso para não sugerir sincronização completa.
- Ao sair da conta, limpar usuário, token e produtos carregados da API; não apagar os módulos locais adiados.

### 5. Preparação do backend

- Preservar os contratos públicos existentes; não criar endpoints nesta fase.
- Alinhar `.env.example` com `PORT=3333` e adicionar `CORS_ORIGIN=http://localhost:5173`.
- Confirmar que cadastro e login retornam `{ token, user }`, que `/me` valida a sessão e que todas as rotas de produtos filtram pelo usuário autenticado.
- Manter validação estrita no backend para impedir o envio acidental de campos antigos.
- Atualizar README e documentação do frontend, removendo qualquer indicação de autenticação ou produtos simulados.

## Interfaces públicas utilizadas

| Operação | Método e rota | Corpo/resultado principal |
|---|---|---|
| Cadastro | `POST /auth/register` | `{ nome, email, senha }` → `{ token, user }` |
| Login | `POST /auth/login` | `{ email, senha }` → `{ token, user }` |
| Restaurar sessão | `GET /me` | `{ user }` |
| Logout | `POST /auth/logout` | `{ success: true }` |
| Listar produtos | `GET /products` | `Product[]` |
| Criar produto | `POST /products` | `ProductInput` → `Product` |
| Editar produto | `PATCH /products/:id` | campos alterados → `Product` |
| Excluir produto | `DELETE /products/:id` | `204` |

O cliente deve expor um erro normalizado com `status`, `code`, `message` e `details`, independentemente de a falha ser HTTP, validação ou indisponibilidade de rede.

## Testes e aceitação

- Testar o cliente HTTP: URL base, Bearer Token, JSON, `204`, erro de rede e respostas `400`, `401`, `404` e `409`.
- Testar autenticação: cadastro, login inválido, senha curta, restauração por `/me`, token expirado e logout com API indisponível.
- Testar produtos: carregamento, lista vazia, criação, edição, exclusão, validação e preservação do formulário após erro.
- Transformar os testes `TODO` de autenticação e produtos do backend em testes reais com banco isolado.
- Confirmar isolamento entre dois usuários e rejeição de requisições protegidas sem token.
- Executar `npm run lint`, `npm test` e `npm run build` no frontend, além de `npm test` no backend.
- Fazer teste manual com os dois servidores:
  1. Criar usuário.
  2. Recarregar a página e restaurar a sessão.
  3. Criar, editar e excluir produto.
  4. Confirmar os dados diretamente pela API.
  5. Fazer logout e verificar revogação do token.
  6. Entrar com outro usuário e confirmar isolamento dos produtos.

## Premissas

- Esta fase não integra perfil, custos, precificação, máquinas, aluguéis ou dashboard.
- Imagens ficam fora do MVP; nenhuma imagem Base64 será enviada ao backend.
- Não haverá importação dos usuários ou produtos antigos do navegador.
- A sessão dura apenas enquanto a aba estiver aberta, conforme o uso de `sessionStorage`.
- A API e o banco precisam estar disponíveis para autenticação e produtos; não haverá fallback offline para esses recursos.
