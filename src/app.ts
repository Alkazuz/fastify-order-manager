import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';

import { registerAuth } from './auth/index.js';
import { getDatabaseOptions } from './database/index.js';
import { registerDocs } from './docs/index.js';
import { setErrorHandlers } from './errors/error-handler.js';
import { registerRoutes } from './routes/index.js';

// Funcao para construir a aplicacao Fastify
export function buildApp() {
  // Criar uma instancia do Fastify com o logger habilitado
  const app = Fastify({
    logger: true,
  });

  // Registrar o plugin de conexao com o banco de dados no escopo raiz
  void app.register(fastifyPostgres, getDatabaseOptions());
  // Registrar autenticacao JWT
  registerAuth(app);
  // Registrar OpenAPI/Swagger
  registerDocs(app);
  // Configurar os manipuladores de erros
  setErrorHandlers(app);
  // Registrar as rotas
  void app.register(registerRoutes);

  // Retornar a instancia do aplicativo Fastify
  return app;
}
