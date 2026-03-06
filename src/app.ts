import Fastify from 'fastify';

import { setErrorHandlers } from './errors/error-handler.js';
import { registerRoutes } from './routes/index.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  setErrorHandlers(app);
  void app.register(registerRoutes);

  return app;
}
