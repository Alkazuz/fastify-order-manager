import type { FastifyPluginAsync } from 'fastify';

import { healthRoutes } from './health.route.js';
import { orderRoutes } from './order.route.js';

export const registerRoutes: FastifyPluginAsync = async (app) => {
  await app.register(healthRoutes);
  await app.register(orderRoutes);
};
