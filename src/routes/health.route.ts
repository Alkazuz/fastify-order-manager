import type { FastifyPluginCallback } from 'fastify';

// Rota de health check da aplicacao
export const healthRoutes: FastifyPluginCallback = (app, _options, done) => {
  app.get('/health', async () => {
    // Verificar se a conexao com o banco responde corretamente
    const result = await app.pg.query('SELECT 1');

    return {
      status: 'ok',
      database: result.rowCount === 1 ? 'connected' : 'unavailable',
    };
  });

  // Finalizar o registro do plugin de rotas
  done();
};
