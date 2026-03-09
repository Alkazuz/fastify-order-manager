import type { FastifyInstance } from 'fastify';

import type { OrderService } from '../../modules/orders/order.service.js';
import {
  createOrderBodySchema,
  mapCreateOrderBodyToInput,
  type CreateOrderBody,
} from '../../modules/orders/validators/create-order.body.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerCreateOrderRoute(
  app: FastifyInstance,
  orderService: OrderService,
): void {
  app.post<{ Body: CreateOrderBody }>(
    '/order',
    {
      schema: {
        body: createOrderBodySchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);

      const orderInput = mapCreateOrderBodyToInput(request.body);
      const createdOrder = await orderService.createOrder(orderInput);

      return reply.status(201).send(createdOrder);
    },
  );
}
