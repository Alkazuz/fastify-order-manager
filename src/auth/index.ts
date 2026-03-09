import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from '../errors/models/unauthorized.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

export function registerAuth(app: FastifyInstance): void {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not set. Please set it to a secure value.',
    );
  }

  void app.register(fastifyJwt, {
    secret,
  });

  app.decorate('authenticate', async function authenticate(request, reply) {
    void reply;

    try {
      await request.jwtVerify();
    } catch {
      throw new UnauthorizedError();
    }
  });
}
