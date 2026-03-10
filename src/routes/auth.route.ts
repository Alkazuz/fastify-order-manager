import type { FastifyPluginCallback } from 'fastify';

import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../modules/auth/auth.service.js';
import type {
  LoginInput,
  LoginResponse,
} from '../modules/auth/auth.service.js';

const loginBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 1, maxLength: 100 },
  },
} as const;

export const authRoutes: FastifyPluginCallback = (app, _options, done) => {
  const authService = new AuthService(app);
  const authController = new AuthController(authService);

  app.post<{ Body: LoginInput; Reply: LoginResponse }>(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Generate JWT token',
        body: loginBodySchema,
      },
      attachValidation: true,
    },
    authController.login.bind(authController),
  );

  done();
};
