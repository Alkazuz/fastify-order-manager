# Fastify Order Manager

API de gerenciamento de pedidos desenvolvida como **desafio técnico para a vaga de Desenvolvedor Fullstack na Jitterbit**.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- JWT com `@fastify/jwt`
- Swagger/OpenAPI com `@fastify/swagger` e `@fastify/swagger-ui`
- Docker / Docker Compose (opcional)
- ESLint + Prettier + Husky

## Estrutura do projeto

```text
.
├── .env.example
├── database/
│   └── init/
│       └── 001_create_tables.sql
├── docker-compose.yml
├── docs/
│   └── fastify-order-manager.postman_collection.json
├── scripts/
│   └── db-migrate.js
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── auth/
│   │   └── index.ts
│   ├── controllers/
│   │   ├── base.controller.ts
│   │   └── order.controller.ts
│   ├── database/
│   │   └── index.ts
│   ├── docs/
│   │   └── index.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   ├── error-handler.ts
│   │   └── models/
│   │       ├── invalid-request.ts
│   │       ├── model-already-exists.ts
│   │       ├── model-not-found.ts
│   │       └── unauthorized.ts
│   ├── modules/
│   │   └── orders/
│   │       ├── order.model.ts
│   │       ├── order.mapper.ts
│   │       ├── order.repository.ts
│   │       ├── order.service.ts
│   │       └── validators/
│   │           ├── create-order.body.validator.ts
│   │           ├── order-params.validator.ts
│   │           └── update-order.body.validator.ts
│   └── routes/
│       ├── auth.route.ts
│       ├── health.route.ts
│       ├── index.ts
│       ├── order.route.ts
│       └── orders/
│           ├── create-order.route.ts
│           ├── delete-order.route.ts
│           ├── get-order.route.ts
│           ├── list-orders.route.ts
│           ├── update-order.route.ts
│           └── validation.ts
└── README.md
```

## Pré-requisitos

- Node.js 20+
- Yarn ou npm
- PostgreSQL acessível (local, cloud ou Docker)
- Docker e Docker Compose (opcional)

## Como rodar localmente

1. Instalar dependências:

```bash
yarn install
```

2. Criar arquivo de ambiente:

```bash
cp .env.example .env
```

3. Subir PostgreSQL (opcional via Docker):

```bash
yarn db:up
```

4. Aplicar schema no banco:

```bash
yarn db:migrate
```

5. Subir a API:

```bash
yarn dev
```

API disponível em `http://localhost:3000`.

### Observação sobre Docker

- O script SQL em `database/init` é executado automaticamente no **primeiro boot** de um volume novo (`postgres_data` vazio).
- Se o volume já existir, para reaplicar schema você pode rodar `yarn db:migrate`.
- Se você vai reconstruir tudo do zero, pode remover o volume e subir novamente.

## Comandos úteis

```bash
yarn dev          # desenvolvimento (watch)
yarn build        # build TypeScript -> dist
yarn start        # executa versão compilada
yarn db:migrate   # aplica schema SQL no banco configurado
yarn db:up        # sobe postgres via docker-compose.yml
yarn db:down      # derruba containers do docker compose
yarn db:logs      # logs do postgres
yarn lint         # lint
yarn lint:fix     # lint com correções
yarn typecheck    # validação de tipos
yarn check        # lint + typecheck
```

## Endpoints

### Health

- `GET /health`

### Auth

- `POST /auth/login` - gera token JWT

### Orders (protegidas por JWT)

- `POST /order` - cria pedido
- `GET /order/:orderId` - busca pedido por identificador
- `GET /order/list` - lista pedidos
- `PUT /order/:orderId` - atualiza pedido
- `DELETE /order/:orderId` - remove pedido

## Payload esperado para criação

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

### Transformação aplicada internamente

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

## Exemplos de resposta

### Sucesso (201 - POST /order)

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "orderId": "v10089015vdb-01",
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

### Erro de validação (400)

```json
{
  "error": "INVALID_REQUEST",
  "message": "Invalid request body.",
  "details": [
    {
      "field": "items[0].idItem",
      "description": "must match pattern \"^[0-9]+$\""
    }
  ]
}
```

### Erro de negócio (409 - duplicidade)

```json
{
  "error": "MODEL_ALREADY_EXISTS",
  "message": "Order with identifier v10089015vdb-01 already exists.",
  "details": null
}
```

### Erro de recurso não encontrado (404)

```json
{
  "error": "MODEL_NOT_FOUND",
  "message": "Order with identifier nao-existe not found.",
  "details": null
}
```

## Documentação

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/json`
- Postman collection: `docs/fastify-order-manager.postman_collection.json`

### Fluxo da collection no Postman

1. Executar `Auth > Login` (salva `accessToken` automaticamente).
2. Executar requests de `Orders` (todas usam `Bearer {{accessToken}}`).

## Banco de dados

Tabelas utilizadas:

- `Order`
  - `orderId`
  - `value`
  - `creationDate`
- `Items`
  - `orderId`
  - `productId` (inteiro)
  - `quantity`
  - `price`

Script SQL fonte:

- `database/init/001_create_tables.sql`
