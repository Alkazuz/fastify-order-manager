import type { FastifyInstance } from 'fastify';

import type { ItemRow, OrderRow } from './order.model.js';

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
}
