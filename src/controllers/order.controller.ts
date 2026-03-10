import type { FastifyReply, FastifyRequest } from 'fastify';

import { BaseController } from './base.controller.js';
import type { OrderService } from '../modules/orders/order.service.js';
import type { CreateOrderBody } from '../modules/orders/validators/create-order.body.validator.js';
import type { UpdateOrderBody } from '../modules/orders/validators/update-order.body.validator.js';
import type { OrderParams } from '../modules/orders/validators/order-params.validator.js';
import { mapCreateOrderBodyToInput } from '../modules/orders/validators/create-order.body.validator.js';
import { mapUpdateOrderBodyToInput } from '../modules/orders/validators/update-order.body.validator.js';

export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  async create(
    request: FastifyRequest<{ Body: CreateOrderBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const orderInput = mapCreateOrderBodyToInput(request.body);
    const createdOrder = await this.orderService.createOrder(orderInput);

    this.created(reply, createdOrder);
  }

  async getById(
    request: FastifyRequest<{ Params: OrderParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const order = await this.orderService.getOrderById(request.params.orderId);

    this.ok(reply, order);
  }

  async list(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const orders = await this.orderService.listOrders();

    this.okList(reply, orders);
  }

  async update(
    request: FastifyRequest<{ Params: OrderParams; Body: UpdateOrderBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const orderInput = mapUpdateOrderBodyToInput(request.body);
    const updatedOrder = await this.orderService.updateOrder(
      request.params.orderId,
      orderInput,
    );

    this.ok(reply, updatedOrder);
  }

  async delete(
    request: FastifyRequest<{ Params: OrderParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    await this.orderService.deleteOrder(request.params.orderId);

    this.noContent(reply);
  }
}
