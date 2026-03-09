import type { FastifyInstance } from 'fastify';

import type {
  CreateOrderInput,
  ItemRow,
  OrderRow,
  UpdateOrderInput,
} from './order.model.js';

// Repositorio responsavel por acessar os dados de pedidos no banco
export class OrderRepository {
  constructor(private readonly app: FastifyInstance) {}

  // Buscar pedido por ID e seus itens relacionados
  async findOrderById(orderId: string): Promise<OrderRow | null> {
    // Executa a consulta SQL para buscar o pedido pelo ID, utilizando o cliente PostgreSQL do Fastify
    const result = await this.app.pg.query<OrderRow>(
      `
      SELECT *
      FROM orders
      WHERE order_id = $1
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
      SELECT *
      FROM items
      WHERE order_id = $1
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
      SELECT *
      FROM items
      WHERE order_id = ANY($1)
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
      SELECT *
      FROM orders
    `,
    );

    // Retorna todos os resultados encontrados
    return result.rows;
  }

  async createOrder(
    orderInput: CreateOrderInput,
  ): Promise<{ order: OrderRow; items: ItemRow[] }> {
    return this.app.pg.transact(async (client) => {
      const orderInsertResult = await client.query<OrderRow>(
        `
        INSERT INTO orders (order_id, value, creation_date)
        VALUES ($1, $2, $3)
        RETURNING *
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
          INSERT INTO items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
          RETURNING *
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
  }

  async updateOrder(
    orderId: string,
    orderInput: UpdateOrderInput,
  ): Promise<{ order: OrderRow; items: ItemRow[] } | null> {
    return this.app.pg.transact(async (client) => {
      const orderUpdateResult = await client.query<OrderRow>(
        `
        UPDATE orders
        SET value = $2, creation_date = $3
        WHERE order_id = $1
        RETURNING *
      `,
        [orderId, orderInput.value, orderInput.creationDate],
      );

      const updatedOrder = orderUpdateResult.rows[0];
      if (!updatedOrder) {
        return null;
      }

      await client.query(
        `
        DELETE FROM items
        WHERE order_id = $1
      `,
        [orderId],
      );

      const updatedItems: ItemRow[] = [];

      for (const item of orderInput.items) {
        const itemInsertResult = await client.query<ItemRow>(
          `
          INSERT INTO items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
          RETURNING *
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
      DELETE FROM orders
      WHERE order_id = $1
    `,
      [orderId],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
