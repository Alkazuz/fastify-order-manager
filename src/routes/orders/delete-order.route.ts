import type { FastifyInstance } from 'fastify';

import type { OrderService } from '../../modules/orders/order.service.js';
import {
  orderParamsSchema,
  type OrderParams,
} from '../../modules/orders/validators/order-params.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerDeleteOrderRoute(
  app: FastifyInstance,
  orderService: OrderService,
): void {
  app.delete<{ Params: OrderParams }>(
    '/order/:orderId',
    {
      schema: {
        params: orderParamsSchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);

      await orderService.deleteOrder(request.params.orderId);
      return reply.status(204).send();
    },
  );
}
