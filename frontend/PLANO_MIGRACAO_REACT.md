# Migração do AgroJusto para React

## Objetivo e decisões

Converter o protótipo em uma aplicação React dentro de `frontend/`, preservando o visual, a responsividade e as funcionalidades atuais.

- Manter JavaScript com JSX e a configuração existente do Vite.
- Manter os dados no `localStorage`, conforme escolhido.
- Reutilizar o CSS atual, sem reescrever a interface em Tailwind.
- Manter navegação por abas, sem adicionar React Router.
- Deixar integração com backend para outra etapa.
- Preservar os três arquivos originais como referência durante a migração.

## 1. Preparar a estrutura e migrar o HTML

O `frontend/src/App.jsx` atual está incompleto e contém uma interface de produtos diferente do protótipo. Substituí-lo pela composição da aplicação migrada.

Organizar o código em componentes, páginas, hooks, serviços, dados iniciais e funções utilitárias:

| Área | Componentes principais | Responsabilidade |
|---|---|---|
| Estrutura | `App`, `Header`, `Tabs` | Acesso, cabeçalho e navegação |
| Autenticação | `AuthPage`, `LoginForm`, `RegisterForm` | Login, cadastro e indicador de senha |
| Início | `HomePage` | Apresentação e atalhos |
| Precificação | `PricingPage`, `PricingForm`, `CostHistory` | Simulação, registro e aplicação de custos |
| Produtos | `ProductsPage`, `ProductForm`, `ProductCard` | Cadastro, listagem e exclusão |
| Máquinas | `MachinesPage`, `MachineForm`, `MachineCard`, `RentalModal`, `RentalHistory` | Catálogo e aluguéis |
| Painel | `DashboardPage`, `ProfileModal`, `DashboardCharts` | Perfil, indicadores, gráficos e relatório |

Na conversão para JSX:

- Trocar `class` por `className` e ajustar atributos como `autoComplete` e `minLength`.
- Transformar listas geradas por strings em componentes renderizados com `.map()` e `key` pelo ID.
- Substituir eventos HTML e listeners por `onClick`, `onChange` e `onSubmit`.
- Preservar textos, campos, imagens e atributos de acessibilidade.

Atualizar `frontend/index.html` com idioma `pt-BR`, título, descrição e fontes do AgroJusto. Importar o CSS original pela entrada React e retirar estilos do template e diretivas Tailwind que interfiram na aparência. Usar Font Awesome via pacote npm, mantendo as classes de ícones existentes.

## 2. Converter o JavaScript em estado e regras reutilizáveis

Criar um `AgroProvider` com Context e `useReducer` para compartilhar autenticação, usuários, perfil, produtos, máquinas, aluguéis, custos e histórico de preços. Expor esses dados e ações por um hook `useAgro`.

- Manter campos de formulários, mensagens e abertura de modais em estados locais.
- Controlar a aba ativa com estado React; preservar os dados digitados ao trocar de aba.
- Substituir `innerHTML`, alterações de `textContent` e chamadas `render*()` por JSX derivado do estado.
- Atualizar arrays e objetos de forma imutável.
- Calcular indicadores a partir dos dados existentes, sem guardar cópias redundantes.

Extrair funções independentes de React para precificação, força de senha, duração do aluguel, formatação monetária, referências de produtos e resolução de imagens.

Preservar as regras atuais, incluindo:

- Multiplicadores de oferta e demanda, margem e transporte.
- Limite das últimas 20 simulações.
- Aplicação dos custos registrados aos campos da calculadora.
- Preço de referência para sacas de 60 kg quando o preço informado não prevalecer.
- Contagem inclusiva dos dias de aluguel e atualização conjunta da máquina e do aluguel.
- Indicadores e custos dos gráficos calculados a partir do histórico de simulações.

## 3. Persistência e bibliotecas

**Armazenamento:** centralizar leitura e gravação em um serviço, preservando as chaves `agrojusto.*` e os formatos atuais. Inicializar o estado com os dados salvos e usar valores padrão quando estiverem ausentes ou o JSON estiver inválido. Persistir alterações sem duplicar cadastros ou simulações no `StrictMode`.

A compatibilidade vale para dados acessíveis na mesma origem do navegador. Documentar que abrir o React em outra porta ou domínio não transfere automaticamente o armazenamento do protótipo.

**Modais:** manter `<dialog>`, controlado por estado e `ref`, sincronizando abertura, cancelamento e fechamento, inclusive pela tecla Escape.

**Gráficos:** instalar Chart.js via npm e encapsular os gráficos em componentes com referência ao canvas. Criar ou atualizar as instâncias quando o painel estiver visível e destruí-las na limpeza do efeito.

**PDF:** instalar jsPDF via npm e extrair a exportação para uma função que receba os dados do relatório. Preservar conteúdo e nome do arquivo.

Não criar endpoints nem alterar contratos do backend. A autenticação continua sendo a simulação local existente, sem introduzir autenticação de servidor ou separação de dados por conta.

## 4. Ordem de entrega e validação

Implementar em etapas verificáveis:

1. Estrutura React, CSS, cabeçalho e navegação.
2. Estado compartilhado, armazenamento, login, cadastro e perfil.
3. Produtos.
4. Precificação e histórico de custos.
5. Máquinas e ciclo de aluguel.
6. Painel, gráficos e PDF.
7. Revisão visual e atualização do README com execução pelo diretório `frontend/`.

Adicionar testes unitários com Vitest para as regras extraídas: cálculo de preços e seus multiplicadores, quantidade inválida, limite do histórico, agregação de custos, referência de sacas, força de senha e duração dos aluguéis.

Validar os fluxos no navegador:

- Cadastro válido, e-mail repetido, senha fraca, confirmação divergente, login, demonstração e logout.
- Cadastro e exclusão de produtos, máquinas e custos; listas vazias e imagens indisponíveis.
- Aplicação dos custos, cálculo e atualização dos indicadores.
- Aluguel no mesmo dia, intervalo inválido e encerramento com liberação da máquina.
- Edição e cancelamento do perfil; abertura e fechamento dos modais.
- Persistência após recarregar, sem duplicações.
- Gráficos após alternar abas e PDF com os dados exibidos.
- Aparência em celular e desktop comparada ao protótipo.

**Critério de conclusão:** todas as funcionalidades do protótipo disponíveis no React, sem depender do `script.js` original ou da API, com `npm run lint` e `npm run build` aprovados.
