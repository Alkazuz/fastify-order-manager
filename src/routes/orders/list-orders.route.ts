import type { FastifyInstance } from 'fastify';

import type { OrderService } from '../../modules/orders/order.service.js';

export function registerListOrdersRoute(
  app: FastifyInstance,
  orderService: OrderService,
): void {
  app.get('/order/list', async (_request, reply) => {
    const orders = await orderService.listOrders();
    return reply.status(200).send(orders);
  });
}
