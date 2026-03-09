import type { FastifyPluginCallback } from 'fastify';

import { InvalidRequestError } from '../errors/models/invalid-request.js';
import { OrderService } from '../modules/orders/order.service.js';
import {
  createOrderBodySchema,
  mapCreateOrderBodyToInput,
  type CreateOrderBody,
} from '../modules/orders/validators/create-order.body.validator.js';

// Rota para operacoes relacionadas a pedidos
export const orderRoutes: FastifyPluginCallback = (app, _options, done) => {
  const orderService = new OrderService(app);

  // Rota POST /order - Criar um novo pedido
  app.post<{ Body: CreateOrderBody }>(
    '/order',
    {
      schema: {
        body: createOrderBodySchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      if (request.validationError) {
        // Mapeia os erros de validação do Fastify para o formato esperado pelo InvalidRequestError
        throw InvalidRequestError.fromFastifyValidation(
          request.validationError.validation,
        );
      }

      // Mapeia o body da request para o formato esperado pelo serviço de pedido
      const orderInput = mapCreateOrderBodyToInput(request.body);
      // Chama o serviço para criar o pedido
      const createdOrder = await orderService.createOrder(orderInput);

      return reply.status(201).send(createdOrder);
    },
  );

  done();
};
