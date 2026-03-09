import { AppError } from '../app-error.js';

export class ModelAlreadyExistsError extends AppError {
  constructor(modelName: string, identifier: string | number) {
    super({
      message: `${modelName} with identifier ${identifier} already exists.`,
      statusCode: 409,
      code: 'MODEL_ALREADY_EXISTS',
    });
  }
}
