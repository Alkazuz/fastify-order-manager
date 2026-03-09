# Fastify Order Manager

API de gerenciamento de pedidos desenvolvida como **desafio técnico para a vaga de Desenvolvedor Fullstack na Jitterbit**.

## Contexto

O objetivo do desafio é expor uma API para operações de pedido com persistência em banco de dados, incluindo criação, consulta, listagem, atualização e exclusão.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Fastify
- JWT com `@fastify/jwt`
- PostgreSQL
- Docker / Docker Compose (opcional)
- Swagger (OpenAPI) com `@fastify/swagger` e `@fastify/swagger-ui`
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
│   ├── database/
│   │   └── index.ts
│   ├── docs/
│   │   └── index.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   ├── error-handler.ts
│   │   └── models/
│   │       ├── invalid-request.ts
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

Credenciais padrão de autenticação (configuráveis via `.env`):

- `JWT_USER=admin`
- `JWT_PASSWORD=admin123`
- `JWT_SECRET=change-me-in-production`

3. Subir o PostgreSQL (opcional via Docker):

```bash
yarn db:up
```

4. Aplicar schema no banco:

```bash
yarn db:migrate
```

> Se você subiu o PostgreSQL com `yarn db:up` e é o primeiro boot com volume vazio, o Docker já aplica `database/init/001_create_tables.sql` automaticamente. Nesse caso, o `db:migrate` é opcional.

5. Rodar a aplicação em modo desenvolvimento:

```bash
yarn dev
```

A API sobe por padrão em `http://localhost:3000`.

## Docker (opcional para banco)

Neste projeto, o Docker é usado para subir apenas o PostgreSQL via `docker-compose.yml`.

```bash
docker compose up -d postgres
docker compose logs -f postgres
docker compose down
```

Observação importante:

- O script em `database/init` roda apenas no primeiro boot do container com volume novo (`postgres_data` vazio).
- Se o volume já existir, o init não roda novamente; para mudanças de schema use `yarn db:migrate` (ou recrie o volume).

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

## Documentação de API

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/json`

## Collection do Postman

A collection está em:

- `docs/fastify-order-manager.postman_collection.json`

Importe no Postman e ajuste a variável `baseUrl` se necessário.

## Endpoints

### Health

- `GET /health`

### Orders

- `POST /order` - cria pedido
- `GET /order/:orderId` - busca pedido por identificador
- `GET /order/list` - lista pedidos
- `PUT /order/:orderId` - atualiza pedido
- `DELETE /order/:orderId` - remove pedido

> As rotas de `Orders` exigem autenticação JWT via header `Authorization: Bearer <token>`.

### Auth

- `POST /auth/login` - gera token JWT

## Exemplo de payload (POST /order)

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

## Exemplo de login (JWT)

Request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer"
}
```

## Exemplos de respostas

### Sucesso (201 - POST /order)

```json
{
  "id": 1,
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "id": 1,
      "orderId": "v10089015vdb-01",
      "productId": "2434",
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

## Banco de dados

O schema da aplicação é aplicado manualmente via CLI:

- `yarn db:migrate`

Arquivo SQL usado pelo comando:

- `database/init/001_create_tables.sql`

### Erro de exceção (404 - pedido não encontrado)

Exemplo para `GET /order/nao-existe`:

```json
{
  "error": "MODEL_NOT_FOUND",
  "message": "Order with identifier nao-existe not found.",
  "details": null
}
```

### Erro de validação de body (400)

Exemplo para `POST /order` com campos inválidos:

```json
{
  "error": "INVALID_REQUEST",
  "message": "Invalid request body.",
  "details": [
    {
      "field": "valorTotal",
      "description": "must be number"
    },
    {
      "field": "items[0].quantidadeItem",
      "description": "must be >= 1"
    }
  ]
}
```

## Banco de dados

As tabelas são criadas automaticamente ao iniciar o container via script:

- `orders`
- `items`

Script SQL:

- `database/init/001_create_tables.sql`

## Observações

- A API valida body e params com JSON Schema nativo do Fastify.
- Erros de validação retornam payload padronizado com detalhes por campo.
- Erros de negócio usam classes customizadas em `src/errors/models`.
