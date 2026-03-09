import { AppError } from '../app-error';

export class ModelNotFoundError extends AppError {
  constructor(modelName: string, identifier: string | number) {
    super({
      message: `${modelName} with identifier ${identifier} not found.`,
      statusCode: 404,
      code: 'MODEL_NOT_FOUND',
    });
  }
}
