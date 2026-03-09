import type { FastifyPluginAsync } from 'fastify';

import { authRoutes } from './auth.route.js';
import { healthRoutes } from './health.route.js';
import { orderRoutes } from './order.route.js';

export const registerRoutes: FastifyPluginAsync = async (app) => {
  await app.register(authRoutes);
  await app.register(healthRoutes);
  await app.register(orderRoutes);
};
