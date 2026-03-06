import type { FastifyPluginCallback } from 'fastify';

export const healthRoutes: FastifyPluginCallback = (app, _options, done) => {
  app.get('/health', () => {
    return { status: 'ok' };
  });

  done();
};
