# Backend do AgroJusto: completar as funcionalidades do protótipo

## 1. Objetivo e arquitetura

Implementar autenticação, perfil, custos, precificação, máquinas, aluguéis e dados do painel, além de completar os campos de produtos.

**Decisões confirmadas:**

- Implementar somente backend, banco, testes e documentação.
- Seguir os fluxos do protótipo: custos e simulações independentes de produtos; locatário informado pelo nome.
- Usar login real e separar os dados por usuário.
- Guardar todas as simulações; calcular os indicadores com as 20 mais recentes.
- Disponibilizar conta e catálogo de demonstração apenas por seed de desenvolvimento.

Manter Express, JavaScript com módulos ES e Prisma com MySQL/MariaDB, conforme a configuração efetiva do repositório. Corrigir a documentação que ainda indica PostgreSQL.

Organizar cada funcionalidade em rotas, validação, serviços de negócio e serialização. Compartilhar middleware de autenticação e tratamento de erros. Não criar uma camada genérica de repositórios nesta etapa.

## 2. Banco de dados e autenticação

### Ajustes nos modelos

| Modelo | Alterações |
|---|---|
| `Usuario` | Adicionar região, biografia e foto; armazenar hash no campo de senha; usar `PRODUTOR` como tipo padrão |
| Sessão | Criar vínculo com usuário, hash do token, criação e expiração |
| `Produto` | Adicionar preço e imagem; preservar quantidade decimal e os demais campos existentes |
| `Custo` | Adicionar proprietário e data do custo; tornar o vínculo com produto opcional |
| `PrecoJusto` | Adicionar proprietário, entradas completas da simulação, oferta, demanda, custo por distância e custo unitário; tornar produto opcional |
| `Equipamento` | Adicionar condições, dias disponíveis, imagem e marcação de exclusão |
| `Aluguel` | Tornar conta do locatário opcional; adicionar nome do locatário, nome da máquina no momento do contrato e data de criação |

Dias disponíveis da máquina continuam sendo texto informativo. Não implementar calendário ou regras de reservas futuras nesta etapa.

### Cadastro e sessões

- Cadastro recebe `nome`, `email`, `senha` e `confirmacao`; normaliza e-mail e aplica as regras de força e confirmação do protótipo.
- Hash de senha com `scrypt` assíncrono, salt aleatório individual e parâmetros registrados junto ao hash. Usar comparação resistente a diferenças de tempo. Referência: [Node.js Crypto](https://nodejs.org/api/crypto.html).
- Criar token opaco aleatório de 32 bytes; guardar apenas seu hash no banco.
- Retornar token e expiração no cadastro e login; receber `Authorization: Bearer <token>` nas rotas protegidas.
- Sessões expiram em sete dias; logout revoga a sessão atual. Sem renovação automática nesta etapa.
- Nunca retornar senha ou hash; limitar tentativas nas rotas de cadastro e login.
- Substituir `x-user-id` e `DEFAULT_USER_ID` pela identidade da sessão, inclusive em produtos.
- Toda leitura e alteração deve filtrar pelo usuário autenticado; recursos de outro usuário respondem como não encontrados.

### Migração

Criar migrações incrementais, preservando registros existentes. Preencher proprietário de custos e simulações pelo produto vinculado; preencher nome do locatário pela conta relacionada.

Campos históricos de cálculo que não possam ser reconstruídos ficam nulos, sem inventar valores. Novas simulações exigem todas as entradas; o painel informa quando o detalhamento de custos históricos estiver incompleto.

Inspecionar o histórico aplicado antes de migrar. Se o banco tiver sido criado por `db push`, estabelecer uma baseline compatível antes das novas migrações, conforme [documentação do Prisma](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining). Não resetar o banco nem modificar migrações já aplicadas.

### Estratégia de expansão e preservação de dados

As alterações que adicionam campos obrigatórios devem ser executadas em duas fases, para que registros existentes continuem válidos durante toda a migração.

**Produto (`preco`):**

1. Primeira migração: adicionar `preco` como `Decimal?`, sem exigir valor para os registros antigos.
2. Backfill: preencher `preco` dos produtos existentes usando a referência estática de saca de 60 kg do protótipo quando aplicável. Registros sem referência confiável permanecem identificados para revisão, sem inventar valores.
3. Validação: confirmar que todos os registros que serão mantidos no contrato obrigatório possuem valor válido e compatível com os limites do banco.
4. Segunda migração: somente após o backfill e a validação, alterar `preco` para `Decimal` obrigatório.

**Equipamento (`condicoes` e `dias`):**

1. Primeira migração: adicionar `condicoes` como `String?` e `dias` como `Decimal?`, permitindo que os equipamentos existentes continuem válidos.
2. Backfill: preencher os valores a partir de dados históricos confiáveis. Quando não houver informação suficiente, manter o campo nulo e registrar os casos para revisão, sem criar valores fictícios.
3. Validação: confirmar que os registros que serão usados pelo novo contrato possuem `condicoes` e `dias` preenchidos e válidos.
4. Migração futura: somente depois do backfill e da validação, tornar `condicoes` e `dias` obrigatórios (`String` e `Decimal`).

Durante as duas fases, as migrações devem ser aplicadas em ordem, revisadas em uma cópia do banco e acompanhadas de verificação de contagens e valores antes e depois. Nenhuma etapa deve apagar registros existentes.

## 3. Contratos e regras das funcionalidades

Manter nomes de rotas em inglês, como `/products`, e campos próximos dos usados pelo protótipo. Documentar os contratos em OpenAPI, incluindo exemplos, respostas e autenticação.

### Rotas previstas

| Área | Rotas | Comportamento |
|---|---|---|
| Autenticação | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` | Criar conta, iniciar e encerrar sessão |
| Perfil | `GET /me`, `PATCH /me` | Consultar e atualizar nome, região, biografia e foto |
| Produtos | Rotas existentes de `/products` | Completar cadastro, atualização, listagem e exclusão |
| Custos | `GET /costs`, `POST /costs`, `DELETE /costs/:id` | Histórico próprio de custos |
| Resumo de custos | `GET /costs/summary` | Total geral e totais por categoria para preencher a calculadora |
| Precificação | `POST /pricing/simulations`, `GET /pricing/simulations` | Calcular, salvar e consultar simulações |
| Máquinas | `GET /machines`, `POST /machines`, `DELETE /machines/:id` | Catálogo próprio e exclusão |
| Aluguéis | `GET /rentals`, `POST /rentals`, `POST /rentals/:id/finish` | Registrar, consultar e encerrar contratos |
| Painel | `GET /dashboard` | Perfil, indicadores e séries dos gráficos |

### Produtos e custos

**Produtos:** aceitar e retornar `nome`, `quantidade`, `unidade`, `cultivo`, `regiao`, `preco` e `imagem`, preservando `id` e `createdAt`. Deixar de truncar quantidades e de ignorar preço e cultivo. Quando o preço estiver ausente ou zero, aplicar a referência de saca de 60 kg do protótipo, se houver; essas referências continuam sendo dados estáticos.

**Custos:** receber `categoria`, `descricao`, `valor` e `data`, com as quatro categorias do protótipo. Exigir valor positivo e data válida. Permitir `produtoId` opcional, validando a propriedade do produto.

Excluir produto deve preservar custos e simulações, removendo apenas seu vínculo opcional.

### Precificação

Receber as entradas atuais da calculadora: insumos, mão de obra, transporte base, manutenção, distância, custo por quilômetro, quantidade, margem, oferta e demanda. Aceitar `produtoId` opcional.

Calcular exclusivamente no servidor:

- Custo da distância = distância × custo por quilômetro.
- Custo total = insumos + mão de obra + transporte base + manutenção + custo da distância.
- Custo unitário = custo total ÷ quantidade.
- Preço mínimo = custo unitário × (1 + margem ÷ 100).
- Preço ideal = preço mínimo × multiplicador de oferta e demanda.

Preservar os multiplicadores `0,92`, `1,26`, `0,98`, `1,14` e `1` nas mesmas combinações do protótipo. Quantidade deve ser positiva; custos, distância e margem não podem ser negativos.

Salvar entradas e resultados como uma fotografia do cálculo, independente de alterações posteriores nos custos. Usar aritmética decimal, manter precisão intermediária e arredondar valores monetários finais para centavos.

A consulta do histórico usa `page` e `pageSize`, com padrão de 20 e máximo de 100 registros por página, ordenados do mais recente ao mais antigo.

### Máquinas e aluguéis

**Máquinas:** usar os campos do protótipo: `nome`, `preco`, `tipo`, `condicoes`, `dias`, `imagem` e status de disponibilidade. O cliente não altera diretamente o status.

**Registro de aluguel:** receber `machineId`, `tenant`, `start`, `end` e `notes`. O servidor identifica o proprietário, consulta a diária e calcula dias inclusivos e total. Aluguel no mesmo dia corresponde a uma diária.

- Não exigir conta para o locatário.
- Não aceitar total, diária ou proprietário enviados pelo cliente como fonte de verdade.
- Tratar datas como datas civis, sem variação de duração por fuso horário.
- Permitir somente um aluguel ativo por máquina, mesmo com requisições simultâneas.
- Reservar a máquina e criar o contrato na mesma transação, com atualização condicional da disponibilidade.
- Encerrar o contrato e liberar a máquina na mesma transação; repetir o encerramento não cria efeitos adicionais.
- Bloquear exclusão de máquina com aluguel ativo, retornando conflito.
- Para máquinas sem aluguel ativo, usar exclusão lógica e preservar contratos anteriores.

### Painel e relatório

Retornar perfil, quantidade de produtos, quantidade de máquinas não excluídas, média do preço ideal das últimas 20 simulações, composição dos custos dessas simulações e comparação mínimo/ideal da mais recente.

Sem simulações, retornar indicadores zerados e séries vazias. Usar esses mesmos dados como base para o relatório do produtor.

Gráficos e geração do PDF continuam no frontend; não criar renderização de gráficos ou endpoint de PDF nesta etapa.

## 4. Padrões, testes e critérios de aceitação

### Padrões da API

- Validar os corpos com Zod, rejeitando números não finitos, valores fora dos limites do banco, enums inválidos e campos não permitidos.
- Retornar valores decimais como números JSON; datas civis como `YYYY-MM-DD` e timestamps em ISO 8601.
- Preservar o formato de lista e os campos existentes de produtos; os campos adicionais são aditivos.
- Manter erros com `{ error, code }`, acrescentando detalhes de validação quando necessário.
- Usar `400` para entrada inválida, `401` para sessão inválida, `404` para recurso ausente, `409` para conflitos e `429` para limite de tentativas.
- Restringir CORS às origens configuradas; alinhar configuração de porta e banco entre runtime, Prisma e documentação.
- Registrar erros internos sem credenciais ou tokens; manter `/health` público.

A exigência de sessão em `/products` é uma mudança de contrato intencional e deve constar na documentação.

### Testes

Usar `node:test` e Supertest, com banco MySQL/MariaDB exclusivo para integração.

Cobrir:

- Cadastro, e-mail duplicado, validação de senha, login incorreto, expiração e revogação.
- Dois usuários sem acesso cruzado, inclusive enviando `x-user-id` de outra pessoa.
- Produtos com quantidade fracionada, preço, cultivo, região e imagem.
- Custos independentes e vinculados; resumo por categoria e exclusão.
- Fórmulas e multiplicadores, quantidade zero, arredondamento e histórico superior a 20 simulações.
- Aluguel no mesmo dia, datas inválidas e duas tentativas simultâneas para a mesma máquina.
- Encerramento repetido, liberação da máquina e preservação do histórico.
- Painel vazio, agregação das últimas 20 simulações e registros legados incompletos.
- Migração em banco novo e em cópia com registros anteriores.

### Ordem de implementação

1. Modelos, migrações, validação e erros comuns.
2. Cadastro, sessões, autorização e perfil.
3. Complementação das rotas de produtos.
4. Custos e precificação.
5. Máquinas e aluguéis.
6. Painel, seed local, OpenAPI e coleção Insomnia.
7. Execução dos testes e revisão da documentação.

**Conclusão:** todos os fluxos previstos funcionam pela API e pelo Insomnia, com persistência, isolamento por usuário e testes aprovados. Integração das telas, migração do `localStorage`, recuperação de senha, demonstração pública, marketplace e pagamentos ficam fora desta entrega.
