// Montar a connection string a partir do .env ou de valores padrao locais
export function getConnectionString(): string {
  return (
    process.env.DATABASE_URL ??
    `postgresql://${process.env.POSTGRES_USER ?? 'postgres'}:${process.env.POSTGRES_PASSWORD ?? 'postgres'}@${process.env.POSTGRES_HOST ?? 'localhost'}:${process.env.POSTGRES_PORT ?? '5432'}/${process.env.POSTGRES_DB ?? 'order_manager'}`
  );
}

export function getDatabaseOptions() {
  return {
    connectionString: getConnectionString(),
  };
}
