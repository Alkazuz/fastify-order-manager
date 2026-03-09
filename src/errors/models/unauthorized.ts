import { AppError } from '../app-error.js';

export class UnauthorizedError extends AppError {
  constructor(message = 'Invalid or missing authentication token.') {
    super({
      message,
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }
}
