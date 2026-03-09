import type { FastifyInstance } from 'fastify';

import type {
  CreateOrderInput,
  ItemRow,
  OrderRow,
  UpdateOrderInput,
} from './order.model.js';
import { ModelAlreadyExistsError } from '../../errors/models/model-already-exists.js';

interface PostgresErrorLike {
  code?: string;
}

function isOrderIdUniqueViolation(error: unknown): error is PostgresErrorLike {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const { code } = error as PostgresErrorLike;
  return code === '23505';
}

// Repositorio responsavel por acessar os dados de pedidos no banco
export class OrderRepository {
  constructor(private readonly app: FastifyInstance) {}

  // Buscar pedido por ID e seus itens relacionados
  async findOrderById(orderId: string): Promise<OrderRow | null> {
    // Executa a consulta SQL para buscar o pedido pelo ID, utilizando o cliente PostgreSQL do Fastify
    const result = await this.app.pg.query<OrderRow>(
      `
      SELECT
        id,
        "orderId" AS order_id,
        "value" AS value,
        "creationDate" AS creation_date
      FROM "Order"
      WHERE "orderId" = $1
    `,
      [orderId],
    );

    // Retorna o primeiro resultado encontrado ou null se nenhum pedido for encontrado com o ID fornecido
    return result.rows[0] ?? null;
  }

  async findItemsByOrderId(orderId: string): Promise<ItemRow[]> {
    // Executa a consulta SQL para buscar os itens relacionados a um pedido específico, utilizando o cliente PostgreSQL do Fastify
    const result = await this.app.pg.query<ItemRow>(
      `
      SELECT
        id,
        "orderId" AS order_id,
        "productId" AS product_id,
        "quantity" AS quantity,
        "price" AS price
      FROM "Items"
      WHERE "orderId" = $1
    `,
      [orderId],
    );

    // Retorna todos os resultados encontrados
    return result.rows;
  }

  // Buscar itens de varios pedidos por seus IDs
  async findItemsByOrderIds(orderIds: string[]): Promise<ItemRow[]> {
    // Se a lista de IDs de pedidos estiver vazia, retorna um array vazio para evitar uma consulta desnecessária ao banco de dados
    if (orderIds.length === 0) {
      return [];
    }

    // Executa a consulta SQL para buscar os itens relacionados a vários pedidos, utilizando o operador ANY para filtrar por uma lista de IDs de pedidos, e utilizando o cliente PostgreSQL do Fastify
    const result = await this.app.pg.query<ItemRow>(
      `
      SELECT
        id,
        "orderId" AS order_id,
        "productId" AS product_id,
        "quantity" AS quantity,
        "price" AS price
      FROM "Items"
      WHERE "orderId" = ANY($1)
    `,
      [orderIds],
    );

    // Retorna todos os resultados encontrados
    return result.rows;
  }

  // Buscar todos os pedidos e seus itens relacionados
  async findAllOrders(): Promise<OrderRow[]> {
    // Executa a consulta SQL para buscar todos os pedidos, utilizando o cliente PostgreSQL do Fastify
    const result = await this.app.pg.query<OrderRow>(
      `
      SELECT
        id,
        "orderId" AS order_id,
        "value" AS value,
        "creationDate" AS creation_date
      FROM "Order"
    `,
    );

    // Retorna todos os resultados encontrados
    return result.rows;
  }

  async createOrder(
    orderInput: CreateOrderInput,
  ): Promise<{ order: OrderRow; items: ItemRow[] }> {
    try {
      return await this.app.pg.transact(async (client) => {
        const orderInsertResult = await client.query<OrderRow>(
          `
          INSERT INTO "Order" ("orderId", "value", "creationDate")
          VALUES ($1, $2, $3)
          RETURNING
            id,
            "orderId" AS order_id,
            "value" AS value,
            "creationDate" AS creation_date
        `,
          [orderInput.orderId, orderInput.value, orderInput.creationDate],
        );

        const createdOrder = orderInsertResult.rows[0];
        if (!createdOrder) {
          throw new Error('Failed to create order.');
        }

        const createdItems: ItemRow[] = [];

        for (const item of orderInput.items) {
          const itemInsertResult = await client.query<ItemRow>(
            `
            INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
            VALUES ($1, $2, $3, $4)
            RETURNING
              id,
              "orderId" AS order_id,
              "productId" AS product_id,
              "quantity" AS quantity,
              "price" AS price
          `,
            [orderInput.orderId, item.productId, item.quantity, item.price],
          );

          const createdItem = itemInsertResult.rows[0];
          if (!createdItem) {
            throw new Error('Failed to create order item.');
          }

          createdItems.push(createdItem);
        }

        return { order: createdOrder, items: createdItems };
      });
    } catch (error) {
      if (isOrderIdUniqueViolation(error)) {
        throw new ModelAlreadyExistsError('Order', orderInput.orderId);
      }

      throw error;
    }
  }

  async updateOrder(
    orderId: string,
    orderInput: UpdateOrderInput,
  ): Promise<{ order: OrderRow; items: ItemRow[] } | null> {
    return this.app.pg.transact(async (client) => {
      const orderUpdateResult = await client.query<OrderRow>(
        `
        UPDATE "Order"
        SET "value" = $2, "creationDate" = $3
        WHERE "orderId" = $1
        RETURNING
          id,
          "orderId" AS order_id,
          "value" AS value,
          "creationDate" AS creation_date
      `,
        [orderId, orderInput.value, orderInput.creationDate],
      );

      const updatedOrder = orderUpdateResult.rows[0];
      if (!updatedOrder) {
        return null;
      }

      await client.query(
        `
        DELETE FROM "Items"
        WHERE "orderId" = $1
      `,
        [orderId],
      );

      const updatedItems: ItemRow[] = [];

      for (const item of orderInput.items) {
        const itemInsertResult = await client.query<ItemRow>(
          `
          INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
          VALUES ($1, $2, $3, $4)
          RETURNING
            id,
            "orderId" AS order_id,
            "productId" AS product_id,
            "quantity" AS quantity,
            "price" AS price
        `,
          [orderId, item.productId, item.quantity, item.price],
        );

        const updatedItem = itemInsertResult.rows[0];
        if (!updatedItem) {
          throw new Error('Failed to update order item.');
        }

        updatedItems.push(updatedItem);
      }

      return { order: updatedOrder, items: updatedItems };
    });
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const result = await this.app.pg.query(
      `
      DELETE FROM "Order"
      WHERE "orderId" = $1
    `,
      [orderId],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
