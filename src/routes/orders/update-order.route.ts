import type { FastifyInstance } from 'fastify';

import type { OrderService } from '../../modules/orders/order.service.js';
import {
  orderParamsSchema,
  type OrderParams,
} from '../../modules/orders/validators/order-params.validator.js';
import {
  mapUpdateOrderBodyToInput,
  updateOrderBodySchema,
  type UpdateOrderBody,
} from '../../modules/orders/validators/update-order.body.validator.js';
import { assertRequestIsValid } from './validation.js';

export function registerUpdateOrderRoute(
  app: FastifyInstance,
  orderService: OrderService,
): void {
  app.put<{ Params: OrderParams; Body: UpdateOrderBody }>(
    '/order/:orderId',
    {
      schema: {
        params: orderParamsSchema,
        body: updateOrderBodySchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      assertRequestIsValid(request);

      const orderInput = mapUpdateOrderBodyToInput(request.body);
      const updatedOrder = await orderService.updateOrder(
        request.params.orderId,
        orderInput,
      );

      return reply.status(200).send(updatedOrder);
    },
  );
}
