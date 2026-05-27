# Insomnia (AV2)

A entrega pede o **arquivo exportado do Insomnia** com as rotas organizadas.

## Organização sugerida (coleções/pastas)
AgroJusto
- Health
  - Healthcheck (GET)
- Produtos
  - Listar produtos (GET)
  - Cadastrar produto (POST)
  - Atualizar produto (PATCH)
  - Excluir produto (DELETE)

## Rotas atuais do backend
Base URL (local): `http://localhost:3333`

- `GET /health`
- `GET /products`
- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`

## Exemplos de requisição
### POST /products
Body (JSON):
```json
{
  "nome": "Milho",
  "quantidade": 48,
  "unidade": "saca_60kg",
  "preco": 71
}
```

### PATCH /products/:id
Body (JSON):
```json
{
  "preco": 75.5
}
```

## Como exportar
1. No Insomnia, selecione a coleção `AgroJusto`.
2. Clique em **Export**.
3. Exporte como arquivo (`.json`).
4. Salve aqui na pasta `insomnia/` (ex.: `insomnia/AgroJusto_AV2.json`).

> O arquivo exportado não foi gerado automaticamente aqui porque depende do Insomnia instalado e da coleção criada por vocês.
