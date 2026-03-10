import type { FastifyInstance } from 'fastify';

import { UnauthorizedError } from '../../errors/models/unauthorized.js';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
}

export class AuthService {
  constructor(private readonly app: FastifyInstance) {}

  private getExpectedUsername(): string {
    return process.env.JWT_USER ?? 'admin';
  }

  private getExpectedPassword(): string {
    return process.env.JWT_PASSWORD ?? 'admin123';
  }

  login({ username, password }: LoginInput): LoginResponse {
    if (
      username !== this.getExpectedUsername() ||
      password !== this.getExpectedPassword()
    ) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const accessToken = this.app.jwt.sign({
      sub: username,
      username,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
