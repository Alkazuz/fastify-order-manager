import type { FastifyReply, FastifyRequest } from 'fastify';

import { InvalidRequestError } from '../errors/models/invalid-request.js';
import type {
  LoginInput,
  LoginResponse,
} from '../modules/auth/auth.service.js';
import type { AuthService } from '../modules/auth/auth.service.js';
import { BaseController } from './base.controller.js';

export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ): void {
    if (request.validationError) {
      throw InvalidRequestError.fromFastifyValidation(
        request.validationError.validation,
      );
    }

    const response: LoginResponse = this.authService.login(request.body);

    this.ok(reply, response);
  }
}
