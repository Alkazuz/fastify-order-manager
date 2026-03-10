import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../../controllers/order.controller.js';
import {
  orderParamsSchema,
  type OrderParams,
} from '../../modules/orders/validators/order-params.validator.js';
import {
  updateOrderBodySchema,
  type UpdateOrderBody,
} from '../../modules/orders/validators/update-order.body.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerUpdateOrderRoute(
  app: FastifyInstance,
  orderController: OrderController,
): void {
  app.put<{ Params: OrderParams; Body: UpdateOrderBody }>(
    '/order/:orderId',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Update an existing order',
        security: [{ bearerAuth: [] }],
        params: orderParamsSchema,
        body: updateOrderBodySchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);
      await orderController.update(request, reply);
    },
  );
}
