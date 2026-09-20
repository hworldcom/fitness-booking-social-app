import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseRuntimeConfig } from "./env";
import * as schema from "./schema";

export function createDatabaseConnection(config = databaseRuntimeConfig()) {
  const queryClient = postgres(config.connectionString, {
    max: 1,
    prepare: false,
    ssl: config.ssl,
  });

  return {
    db: drizzle(queryClient, { schema }),
    queryClient,
  };
}

export type DatabaseConnection = ReturnType<typeof createDatabaseConnection>;

let connection: DatabaseConnection | undefined;

export function databaseConnection() {
  connection ??= createDatabaseConnection();
  return connection;
}

export async function closeDatabaseConnection() {
  if (!connection) return;
  await connection.queryClient.end();
  connection = undefined;
}
