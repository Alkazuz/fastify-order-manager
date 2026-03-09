import type { FastifyInstance } from 'fastify';

import { toItemModel, toOrderModel } from './order.mapper.js';
import type { CreateOrderInput, Item, Order } from './order.model.js';
import { OrderRepository } from './order.repository.js';
import { ModelNotFoundError } from '../../errors/models/model-not-found.js';

// Servico responsavel por compor o modelo completo de pedido
export class OrderService {
  private readonly repository: OrderRepository;

  constructor(app: FastifyInstance) {
    // Inicializa o repositório de pedidos, que é responsável por acessar os dados no banco de dados
    this.repository = new OrderRepository(app);
  }

  // Listar pedidos com seus respectivos itens
  async listOrders(): Promise<Order[]> {
    // Buscar todos os pedidos no banco de dados
    const orders = await this.repository.findAllOrders();
    // Extrair os IDs dos pedidos para buscar os itens relacionados
    const orderIds = orders.map((order) => order.order_id);
    // Buscar os itens relacionados aos pedidos usando os IDs extraídos
    const items = await this.repository.findItemsByOrderIds(orderIds);

    // Criar um Map para agrupar os itens por order_id, facilitando a composição do modelo completo de cada pedido
    const itemsByOrderId = new Map<string, Item[]>();

    // Laço para agrupar os itens por order_id, facilitando a composição do modelo completo de cada pedido
    for (const item of items) {
      // Agrupar os itens por order_id usando um Map para facilitar a composição do modelo completo de cada pedido
      const currentItems = itemsByOrderId.get(item.order_id) ?? [];
      // Converter o item do banco de dados para o modelo de item e adicioná-lo à lista de itens do pedido correspondente
      currentItems.push(toItemModel(item));
      // Atualizar o Map com a lista de itens para o order_id correspondente
      itemsByOrderId.set(item.order_id, currentItems);
    }

    // Compor o modelo completo de cada pedido com seus itens e retornar a lista
    return orders.map((order) =>
      toOrderModel(order, itemsByOrderId.get(order.order_id) ?? []),
    );
  }

  // Buscar um pedido por ID, lançando um erro se não encontrado
  async getOrderById(orderId: string): Promise<Order> {
    // Buscar o pedido no banco de dados
    const order = await this.repository.findOrderById(orderId);

    // Se o pedido não for encontrado, dispara exception ModelNotFoundError
    if (!order) throw new ModelNotFoundError('Order', orderId);

    // Buscar os itens relacionados ao pedido
    const items = await this.repository.findItemsByOrderId(orderId);

    // Compor o modelo completo do pedido com seus itens e retornar
    return toOrderModel(order, items.map(toItemModel));
  }

  // Criar um novo pedido com seus itens
  async createOrder(orderInput: CreateOrderInput): Promise<Order> {
    const createdOrder = await this.repository.createOrder(orderInput);

    return toOrderModel(
      createdOrder.order,
      createdOrder.items.map((item) => toItemModel(item)),
    );
  }
}
