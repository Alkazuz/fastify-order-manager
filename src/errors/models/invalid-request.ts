import type { FastifySchemaValidationError } from 'fastify';

import { AppError } from '../app-error.js';

export interface InvalidRequestDetail {
  field: string;
  description: string;
}

const NUMBER_TOKEN_PATTERN = /^\d+$/;

function toFieldPath(instancePath: string): string {
  return instancePath
    .split('/')
    .slice(1)
    .map((token) => token.replace(/~1/g, '/').replace(/~0/g, '~'))
    .reduce<string>((path, token) => {
      if (NUMBER_TOKEN_PATTERN.test(token)) {
        return `${path}[${token}]`;
      }

      return path.length > 0 ? `${path}.${token}` : token;
    }, '');
}

function getPropertyName(error: FastifySchemaValidationError): string | null {
  if (
    error.keyword === 'required' &&
    typeof error.params.missingProperty === 'string'
  ) {
    return error.params.missingProperty;
  }

  if (
    error.keyword === 'additionalProperties' &&
    typeof error.params.additionalProperty === 'string'
  ) {
    return error.params.additionalProperty;
  }

  return null;
}

function isFastifySchemaValidationError(
  value: unknown,
): value is FastifySchemaValidationError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'keyword' in value &&
    'instancePath' in value &&
    'schemaPath' in value &&
    'params' in value
  );
}

function getValidationErrors(value: unknown): FastifySchemaValidationError[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isFastifySchemaValidationError);
}

export function mapValidationErrors(
  errors: FastifySchemaValidationError[],
): InvalidRequestDetail[] {
  return errors.map((error) => {
    const basePath = toFieldPath(error.instancePath);
    const property = getPropertyName(error);
    const field = property
      ? basePath.length > 0
        ? `${basePath}.${property}`
        : property
      : basePath || 'body';

    return {
      field,
      description: error.message ?? 'Invalid value.',
    };
  });
}

export class InvalidRequestError extends AppError {
  constructor(details: InvalidRequestDetail[]) {
    super({
      message: 'Invalid request body.',
      statusCode: 400,
      code: 'INVALID_REQUEST',
      details,
    });
  }

  static fromValidationErrors(
    errors: FastifySchemaValidationError[],
  ): InvalidRequestError {
    return new InvalidRequestError(mapValidationErrors(errors));
  }

  static fromFastifyValidation(validation: unknown): InvalidRequestError {
    return InvalidRequestError.fromValidationErrors(
      getValidationErrors(validation),
    );
  }
}
