import 'dotenv/config';

import { buildApp } from './app.js';

// Funcao principal para iniciar o servidor
const start = async (): Promise<void> => {
  // Construir a aplicacao Fastify
  const app = buildApp();
  // Definir a porta do servidor a partir da variavel de ambiente
  const port = Number(process.env.PORT ?? 3000);

  try {
    // Iniciar o servidor escutando em todas as interfaces de rede
    await app.listen({
      host: '0.0.0.0',
      port,
    });
  } catch (error) {
    // Registrar o erro e encerrar o processo se a inicializacao falhar
    app.log.error(error);
    process.exit(1);
  }
};

// Executar a inicializacao do servidor
void start();
