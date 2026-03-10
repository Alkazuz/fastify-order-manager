import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../../controllers/order.controller.js';

export function registerListOrdersRoute(
  app: FastifyInstance,
  orderController: OrderController,
): void {
  app.get(
    '/order/list',
    {
      schema: {
        tags: ['Orders'],
        summary: 'List all orders',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      await orderController.list(request, reply);
    },
  );
}
