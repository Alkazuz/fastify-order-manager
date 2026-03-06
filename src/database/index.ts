import fastifyPostgres from '@fastify/postgres';
import type { FastifyPluginAsync } from 'fastify';

// Montar a connection string a partir do .env ou de valores padrao locais
function getConnectionString(): string {
  return (
    process.env.DATABASE_URL ??
    `postgresql://${process.env.POSTGRES_USER ?? 'postgres'}:${process.env.POSTGRES_PASSWORD ?? 'postgres'}@${process.env.POSTGRES_HOST ?? 'localhost'}:${process.env.POSTGRES_PORT ?? '5432'}/${process.env.POSTGRES_DB ?? 'order_manager'}`
  );
}

// Registrar o plugin oficial do Fastify para conexao com Postgres
export const registerDatabase: FastifyPluginAsync = async (app) => {
  await app.register(fastifyPostgres, {
    connectionString: getConnectionString(),
  });
};
