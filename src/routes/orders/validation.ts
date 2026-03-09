import type { FastifyRequest } from 'fastify';

import { InvalidRequestError } from '../../errors/models/invalid-request.js';

export function assertRequestIsValid(request: FastifyRequest): void {
  if (!request.validationError) {
    return;
  }

  throw InvalidRequestError.fromFastifyValidation(
    request.validationError.validation,
  );
}
