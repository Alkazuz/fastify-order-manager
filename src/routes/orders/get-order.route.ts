import type { FastifyInstance } from 'fastify';

import type { OrderService } from '../../modules/orders/order.service.js';
import {
  orderParamsSchema,
  type OrderParams,
} from '../../modules/orders/validators/order-params.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerGetOrderRoute(
  app: FastifyInstance,
  orderService: OrderService,
): void {
  app.get<{ Params: OrderParams }>(
    '/order/:orderId',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Get order by identifier',
        params: orderParamsSchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);

      const order = await orderService.getOrderById(request.params.orderId);
      return reply.status(200).send(order);
    },
  );
}
