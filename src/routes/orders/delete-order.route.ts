import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../../controllers/order.controller.js';
import {
  orderParamsSchema,
  type OrderParams,
} from '../../modules/orders/validators/order-params.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerDeleteOrderRoute(
  app: FastifyInstance,
  orderController: OrderController,
): void {
  app.delete<{ Params: OrderParams }>(
    '/order/:orderId',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Delete order by identifier',
        security: [{ bearerAuth: [] }],
        params: orderParamsSchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);
      await orderController.delete(request, reply);
    },
  );
}
