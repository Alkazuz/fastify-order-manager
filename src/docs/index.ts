import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export function registerDocs(app: FastifyInstance): void {
  void app.register(swagger, {
    openapi: {
      info: {
        title: 'Fastify Order Manager API',
        description: 'API for order management operations.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local environment',
        },
        {
          url: 'http://172.20.141.112:3000',
          description: 'Docker local environment',
        },
      ],
      tags: [
        {
          name: 'Health',
          description: 'Application health and readiness endpoints.',
        },
        {
          name: 'Auth',
          description: 'Authentication endpoints.',
        },
        {
          name: 'Orders',
          description: 'Order CRUD operations.',
        },
      ],
    },
  });

  void app.register(swaggerUi, {
    routePrefix: '/docs',
    staticCSP: false,
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}
