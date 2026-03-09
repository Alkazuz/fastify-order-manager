import type { FastifyPluginCallback } from 'fastify';

import { OrderService } from '../modules/orders/order.service.js';
import { registerCreateOrderRoute } from './orders/create-order.route.js';
import { registerDeleteOrderRoute } from './orders/delete-order.route.js';
import { registerGetOrderRoute } from './orders/get-order.route.js';
import { registerListOrdersRoute } from './orders/list-orders.route.js';
import { registerUpdateOrderRoute } from './orders/update-order.route.js';

// Rota para operacoes relacionadas a pedidos
export const orderRoutes: FastifyPluginCallback = (app, _options, done) => {
  const orderService = new OrderService(app);

  // Todas as rotas de pedido exigem token JWT valido
  app.addHook('preHandler', async (request, reply) =>
    app.authenticate(request, reply),
  );

  registerCreateOrderRoute(app, orderService);
  registerListOrdersRoute(app, orderService);
  registerGetOrderRoute(app, orderService);
  registerUpdateOrderRoute(app, orderService);
  registerDeleteOrderRoute(app, orderService);

  done();
};
