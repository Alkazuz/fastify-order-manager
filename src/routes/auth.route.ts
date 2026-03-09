import type { FastifyPluginCallback } from 'fastify';

import { InvalidRequestError } from '../errors/models/invalid-request.js';
import { UnauthorizedError } from '../errors/models/unauthorized.js';

const loginBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 1, maxLength: 100 },
  },
} as const;

interface LoginBody {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
}

function getExpectedUsername(): string {
  return process.env.JWT_USER ?? 'admin';
}

function getExpectedPassword(): string {
  return process.env.JWT_PASSWORD ?? 'admin123';
}

export const authRoutes: FastifyPluginCallback = (app, _options, done) => {
  app.post<{ Body: LoginBody; Reply: LoginResponse }>(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Generate JWT token',
        body: loginBodySchema,
      },
      attachValidation: true,
    },
    async (request, reply) => {
      if (request.validationError) {
        throw InvalidRequestError.fromFastifyValidation(
          request.validationError.validation,
        );
      }

      const { username, password } = request.body;
      if (
        username !== getExpectedUsername() ||
        password !== getExpectedPassword()
      ) {
        throw new UnauthorizedError('Invalid credentials.');
      }

      const accessToken = await reply.jwtSign({
        sub: username,
        username,
      });

      return reply.status(200).send({
        accessToken,
        tokenType: 'Bearer',
      });
    },
  );

  done();
};
