import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../../controllers/order.controller.js';
import {
  orderParamsSchema,
  type OrderParams,
} from '../../modules/orders/validators/order-params.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerGetOrderRoute(
  app: FastifyInstance,
  orderController: OrderController,
): void {
  app.get<{ Params: OrderParams }>(
    '/order/:orderId',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Get order by identifier',
        security: [{ bearerAuth: [] }],
        params: orderParamsSchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);
      await orderController.getById(request, reply);
    },
  );
}
