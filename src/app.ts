import Fastify from 'fastify';

import { registerDatabase } from './database/index.js';
import { setErrorHandlers } from './errors/error-handler.js';
import { registerRoutes } from './routes/index.js';

// Funcao para construir a aplicacao Fastify
export function buildApp() {
  // Criar uma instancia do Fastify com o logger habilitado
  const app = Fastify({
    logger: true,
  });

  // Registrar o plugin de conexao com o banco de dados
  void app.register(registerDatabase);
  // Configurar os manipuladores de erros
  setErrorHandlers(app);
  // Registrar as rotas
  void app.register(registerRoutes);

  // Retornar a instancia do aplicativo Fastify
  return app;
}
