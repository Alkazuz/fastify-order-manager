# Fastify Order Manager

API de gerenciamento de pedidos desenvolvida como **desafio técnico para a vaga de Desenvolvedor Fullstack na Jitterbit**.

## Contexto

O objetivo do desafio é expor uma API para operações de pedido com persistência em banco de dados, incluindo criação, consulta, listagem, atualização e exclusão.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Docker / Docker Compose
- Swagger (OpenAPI) com `@fastify/swagger` e `@fastify/swagger-ui`
- ESLint + Prettier + Husky

## Estrutura do projeto

```text
.
├── .dockerignore
├── Dockerfile
├── database/
│   └── init/
│       └── 001_create_tables.sql
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── docs/
│   └── fastify-order-manager.postman_collection.json
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── database/
│   │   └── index.ts
│   ├── docs/
│   │   └── index.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   ├── error-handler.ts
│   │   └── models/
│   ├── modules/
│   │   └── orders/
│   │       ├── order.model.ts
│   │       ├── order.mapper.ts
│   │       ├── order.repository.ts
│   │       ├── order.service.ts
│   │       └── validators/
│   └── routes/
│       ├── health.route.ts
│       ├── index.ts
│       ├── order.route.ts
│       └── orders/
└── README.md
```

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Yarn ou npm

## Como rodar localmente (sem Docker para a API)

1. Instalar dependências:

```bash
yarn install
```

2. Criar arquivo de ambiente:

```bash
cp .env.example .env
```

3. Subir o PostgreSQL:

```bash
yarn db:up
```

4. Rodar a aplicação em modo desenvolvimento:

```bash
yarn dev
```

A API sobe por padrão em `http://localhost:3000`.

## Execução com Docker

O projeto possui duas composições separadas:

- `docker-compose.dev.yml`: desenvolvimento (API com hot reload + PostgreSQL)
- `docker-compose.prod.yml`: execução de produção (API compilada + PostgreSQL)

### Desenvolvimento com Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Produção com Docker

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Parar ambientes Docker

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.prod.yml down
```

## Dockerfile

O `Dockerfile` foi organizado em múltiplos estágios:

- `dev`: usa `yarn dev`
- `build`: compila TypeScript para `dist/`
- `production`: instala apenas dependências de runtime e executa `yarn start`

Isso permite aproveitar o mesmo arquivo para desenvolvimento e produção, com imagens menores no ambiente final.

## Comandos úteis

```bash
yarn dev          # desenvolvimento (watch)
yarn build        # build TypeScript -> dist
yarn start        # executa versão compilada
yarn db:up        # sobe apenas postgres (docker-compose.yml legado)
yarn db:down      # derruba containers do compose legado
yarn db:logs      # logs do postgres do compose legado
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
