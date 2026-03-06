import type { FastifyInstance } from 'fastify';

import { AppError } from './app-error.js';

export function setErrorHandlers(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        error: error.code,
        message: error.message,
        details: error.details ?? null,
      });
      return;
    }

    request.log.error(error);

    reply.status(500).send({
      error: 'INTERNAL_ERROR',
      message: 'An internal error occurred.',
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'NOT_FOUND',
      message: `Route ${request.method} ${request.url} not found.`,
    });
  });
}
