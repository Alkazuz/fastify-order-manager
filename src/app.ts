import Fastify from 'fastify';

import { setErrorHandlers } from './errors/error-handler.js';
import { registerRoutes } from './routes/index.js';

// Função para construir a aplicação Fastify
export function buildApp() {
  // Criar uma instância do Fastify com o logger habilitado
  const app = Fastify({
    logger: true,
  });

  // Configurar os manipuladores de erros
  setErrorHandlers(app);
  // Registrar as rotas
  void app.register(registerRoutes);

  // Retornar a instância do aplicativo Fastify
  return app;
}
