import type { FastifyReply } from 'fastify';

export abstract class BaseController {
  protected send<T>(reply: FastifyReply, statusCode: number, data: T): void {
    void reply.status(statusCode).send(data);
  }

  protected sendList<T>(
    reply: FastifyReply,
    statusCode: number,
    items: T[],
  ): void {
    void reply.status(statusCode).send(items);
  }

  protected created<T>(reply: FastifyReply, data: T): void {
    this.send(reply, 201, data);
  }

  protected ok<T>(reply: FastifyReply, data: T): void {
    this.send(reply, 200, data);
  }

  protected noContent(reply: FastifyReply): void {
    void reply.status(204).send();
  }

  protected okList<T>(reply: FastifyReply, items: T[]): void {
    this.sendList(reply, 200, items);
  }
}
