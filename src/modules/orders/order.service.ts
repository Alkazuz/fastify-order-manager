import type { FastifyInstance } from 'fastify';

import { toItemModel, toOrderModel } from './order.mapper.js';
import type {
  CreateOrderInput,
  Order,
  UpdateOrderInput,
} from './order.model.js';
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
    const orders = await this.repository.findAllOrders();
    const orderIds = orders.map((order) => order.order_id);
    const itemRows = await this.repository.findItemsByOrderIds(orderIds);

    const itemsByOrderId = new Map<string, Order['items']>();

    for (const itemRow of itemRows) {
      const currentItems = itemsByOrderId.get(itemRow.order_id) ?? [];
      currentItems.push(toItemModel(itemRow));
      itemsByOrderId.set(itemRow.order_id, currentItems);
    }

    return orders.map((order) =>
      toOrderModel(order, itemsByOrderId.get(order.order_id) ?? []),
    );
  }

  // Buscar um pedido por ID, lançando um erro se não encontrado
  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.repository.findOrderById(orderId);

    if (!order) throw new ModelNotFoundError('Order', orderId);

    const itemRows = await this.repository.findItemsByOrderId(orderId);

    return toOrderModel(order, itemRows.map(toItemModel));
  }

  // Criar um novo pedido com seus itens
  async createOrder(orderInput: CreateOrderInput): Promise<Order> {
    const createdOrder = await this.repository.createOrder(orderInput);

    return toOrderModel(
      createdOrder.order,
      createdOrder.items.map(toItemModel),
    );
  }

  async updateOrder(
    orderId: string,
    orderInput: UpdateOrderInput,
  ): Promise<Order> {
    const updatedOrder = await this.repository.updateOrder(orderId, orderInput);

    if (!updatedOrder) throw new ModelNotFoundError('Order', orderId);

    return toOrderModel(
      updatedOrder.order,
      updatedOrder.items.map(toItemModel),
    );
  }

  async deleteOrder(orderId: string): Promise<void> {
    const deleted = await this.repository.deleteOrder(orderId);
    if (!deleted) throw new ModelNotFoundError('Order', orderId);
  }
}
