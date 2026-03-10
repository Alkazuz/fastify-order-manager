import type { FastifyInstance } from 'fastify';

import type { OrderController } from '../../controllers/order.controller.js';
import {
  createOrderBodySchema,
  type CreateOrderBody,
} from '../../modules/orders/validators/create-order.body.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerCreateOrderRoute(
  app: FastifyInstance,
  orderController: OrderController,
): void {
  app.post<{ Body: CreateOrderBody }>(
    '/order',
    {
      schema: {
        tags: ['Orders'],
        summary: 'Create a new order',
        security: [{ bearerAuth: [] }],
        body: createOrderBodySchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);
      await orderController.create(request, reply);
    },
  );
}
