# Fastify Order Manager

> 🚀 Sistema de gerenciamento de pedidos com arquitetura em camadas, desenvolvido com Fastify e TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.8-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

Este projeto foi desenvolvido como parte do desafio técnico da **Jitterbit**, implementando uma API RESTful completa para gerenciamento de pedidos com autenticação JWT e documentação Swagger.

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Stack](#-stack)
- [Arquitetura](#-arquitetura)
- [Instalação e Configuração](#-instalação-e-configuração)
- [API](#-api)
- [Modelo de Dados](#-modelo-de-dados)
- [Qualidade](#-qualidade)
- [Desenvolvimento](#-desenvolvimento)

---

## 🎯 Visão Geral

API REST para gerenciar pedidos (criar, listar, buscar, atualizar e remover), com:

- **Segurança**: autenticação com JWT nas rotas de pedido
- **Documentação**: Swagger para visualizar e testar endpoints
- **Organização**: separação por camadas (routes, controllers, services e repositories)
- **Qualidade**: lint, formatação e verificação de tipos

### ⚡ Decisões Técnicas

**Por que TypeScript?**  
Escolhi TypeScript para ter tipagem e reduzir erros comuns durante o desenvolvimento.

**Por que Fastify?**  
Escolhi Fastify por ser simples de configurar, rápido e ter boa integração com plugins.

**Por que Arquitetura em Camadas?**  
Usei essa separação para deixar o código mais organizado e facilitar manutenção.

---

## 🛠 Stack

### Core

| Tecnologia     | Versão | Propósito                                           |
| -------------- | ------ | --------------------------------------------------- |
| **Node.js**    | 20+    | Runtime JavaScript com suporte a ECMAScript modules |
| **TypeScript** | 5.9    | Tipagem estática no desenvolvimento                 |
| **Fastify**    | 5.8    | Framework web para construção da API                |
| **PostgreSQL** | 16     | Banco de dados relacional                           |

### Bibliotecas Principais

- **@fastify/jwt** - Autenticação stateless com tokens JWT
- **@fastify/postgres** - Cliente PostgreSQL otimizado para Fastify
- **@fastify/swagger** + **@fastify/swagger-ui** - Documentação OpenAPI 3.0
- **pg** - Driver PostgreSQL nativo

### Ferramentas de Qualidade

- **ESLint** + **typescript-eslint** - Linting com regras específicas para TS
- **Prettier** - Formatação consistente de código
- **Husky** + **lint-staged** - Git hooks para qualidade no commit
- **tsx** - Execução TypeScript em desenvolvimento com watch mode

### Infraestrutura

- **Docker Compose** - Containerização do PostgreSQL
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 🏗 Arquitetura

A aplicação foi organizada em camadas:

```
┌──────────────────────────────────────────────────────────────┐
│  HTTP Request (JSON)                                          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  ROUTES LAYER                                                 │
│  • Define endpoints e métodos HTTP                            │
│  • Aplica validação de schema (JSON Schema)                   │
│  • Gerencia middleware de autenticação                        │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  CONTROLLERS LAYER                                            │
│  • Recebe requisição validada                                 │
│  • Delega lógica para Services                                │
│  • Formata respostas HTTP (200, 201, 204, 4xx, 5xx)          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  SERVICES LAYER                                               │
│  • Contém regras de negócio                                   │
│  • Orquestra chamadas a Repositories                          │
│  • Aplica mappers e validações                                │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  REPOSITORIES LAYER                                           │
│  • Abstrai acesso ao banco de dados                           │
│  • Executa queries SQL via pg client                          │
│  • Gerencia transações                                        │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  PostgreSQL Database                                          │
└──────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados: Criação de Pedido

```
1. POST /order
   Body: { numeroPedido, valorTotal, dataCriacao, items[] }
          ↓
2. Route valida schema JSON
          ↓
3. Controller chama OrderService.createOrder()
          ↓
4. Service aplica regras de negócio
          ↓
5. Repository executa INSERT em transação
          ↓
6. Service retorna Order com Items
          ↓
7. Controller responde 201 Created
```

### Estrutura de Diretórios

```
src/
├── controllers/          # Manipuladores HTTP (BaseController, AuthController, OrderController)
├── routes/               # Definição de endpoints e validações
├── modules/
│   ├── auth/            # Lógica de autenticação JWT
│   └── orders/          # Domínio de pedidos
│       ├── order.model.ts       # Tipos TypeScript
│       ├── order.mapper.ts      # Conversão entre formatos internos
│       ├── order.service.ts     # Regras de negócio
│       ├── order.repository.ts  # Acesso ao banco
│       └── validators/          # Schemas de validação
├── errors/              # Error handlers customizados
├── database/            # Configuração de conexão
└── docs/                # Setup do Swagger
```

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL 14+ (ou Docker)
- Yarn ou npm

### Passo 1: Clonar e Instalar

```bash
git clone https://github.com/Alkazuz/fastify-order-manager.git
cd fastify-order-manager
yarn install
```

### Passo 2: Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=order_manager

# JWT
JWT_SECRET=seu-segredo-aqui-min-32-chars
JWT_USER=admin
JWT_PASSWORD=admin123

# Server
PORT=3000
```

### Passo 3: Inicializar Banco de Dados

**Opção A: Com Docker**

```bash
yarn db:up      # Sobe container PostgreSQL
yarn db:migrate # Aplica schema
```

**Opção B: PostgreSQL Local**

```bash
# Certifique-se de que o PostgreSQL está rodando
yarn db:migrate
```

### Passo 4: Executar Aplicação

```bash
yarn dev        # Modo desenvolvimento
# ou
yarn build      # Build de produção
yarn start      # Executa build
```

A API estará disponível em `http://localhost:3000`  
Documentação Swagger em `http://localhost:3000/docs`

---

## 🔌 API

### Autenticação

Todos os endpoints de pedidos exigem header:

```
Authorization: Bearer <seu_token_jwt>
```

Para obter token:

**POST** `/auth/login`

```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### Endpoints de Pedidos

| Método   | Endpoint          | Autenticação | Descrição                 |
| -------- | ----------------- | ------------ | ------------------------- |
| `GET`    | `/health`         | ❌           | Health check da aplicação |
| `POST`   | `/order`          | ✅           | Cria novo pedido          |
| `GET`    | `/order/:orderId` | ✅           | Busca pedido específico   |
| `GET`    | `/order/list`     | ✅           | Lista todos os pedidos    |
| `PUT`    | `/order/:orderId` | ✅           | Atualiza pedido           |
| `DELETE` | `/order/:orderId` | ✅           | Remove pedido             |

### Exemplo de Criação de Pedido

**Request**

```http
POST /order HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "numeroPedido": "ORD-2024-001",
  "valorTotal": 25000,
  "dataCriacao": "2024-03-09T10:30:00.000Z",
  "items": [
    {
      "idItem": "1001",
      "quantidadeItem": 5,
      "valorItem": 5000
    }
  ]
}
```

**Response (201 Created)**

```json
{
  "orderId": "ORD-2024-001",
  "value": 25000,
  "creationDate": "2024-03-09T10:30:00.000Z",
  "items": [
    {
      "orderId": "ORD-2024-001",
      "productId": 1001,
      "quantity": 5,
      "price": 5000
    }
  ]
}
```

### Tratamento de Erros

A API retorna erros estruturados:

```json
{
  "error": "MODEL_NOT_FOUND",
  "message": "Order with identifier XYZ not found.",
  "details": null
}
```

Códigos de status:

- `400` - Dados inválidos
- `401` - Não autenticado
- `404` - Recurso não encontrado
- `409` - Conflito (ex: pedido duplicado)
- `500` - Erro interno

---

## 🗄 Modelo de Dados

### Schema PostgreSQL

```sql
-- Tabela principal de pedidos
CREATE TABLE "Order" (
  "orderId" VARCHAR(255) PRIMARY KEY,
  "value" INTEGER NOT NULL,
  "creationDate" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE "Items" (
  "orderId" VARCHAR(255) REFERENCES "Order"("orderId") ON DELETE CASCADE,
  "productId" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" INTEGER NOT NULL,
  PRIMARY KEY ("orderId", "productId")
);
```

---

## ✅ Qualidade

### Verificações

```bash
yarn typecheck  # Verifica tipos TypeScript
yarn lint       # Verifica regras ESLint
yarn format     # Formata com Prettier
```

### Git Hooks

O Husky está configurado para executar antes do commit:

- Prettier em arquivos modificados
- ESLint em arquivos TypeScript
- Verificação de tipos

---

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev          # Inicia com live reload

# Build
yarn build        # Compila TypeScript → JavaScript
yarn start        # Executa versão compilada

# Banco de Dados
yarn db:up        # Inicia PostgreSQL (Docker)
yarn db:down      # Para PostgreSQL
yarn db:migrate   # Aplica migrations
yarn db:logs      # Visualiza logs do banco

# Qualidade
yarn lint         # Executa ESLint
yarn lint:fix     # Corrige problemas automaticamente
yarn format       # Formata código com Prettier
yarn typecheck    # Valida tipos TypeScript
```

### Documentação Adicional

- **Swagger UI**: `http://localhost:3000/docs` - Interface interativa
- **OpenAPI JSON**: `http://localhost:3000/docs/json` - Spec completo
- **Postman**: `docs/fastify-order-manager.postman_collection.json`

---

## 📝 Licença

Este projeto está sob a licença **ISC**.

Desenvolvido por [Alkazuz](https://github.com/Alkazuz) para o desafio técnico da Jitterbit.
