import { AppError } from '../app-error';

// Erro personalizado para indicar que um modelo nao foi encontrado, estendendo a classe base de erros da aplicação
export class ModelNotFoundError extends AppError {
  constructor(modelName: string, identifier: string | number) {
    super({
      message: `${modelName} with identifier ${identifier} not found.`,
      statusCode: 404,
      code: 'MODEL_NOT_FOUND',
    });
  }
}
