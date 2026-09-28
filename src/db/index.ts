import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

const client = postgres(connectionString, {
  ssl:
    connectionString.includes("localhost") ||
    connectionString.includes("placeholder")
      ? false
      : "require",
  max: isBuild ? 1 : 2,
  idle_timeout: 5,
  connect_timeout: 10,
  prepare: false,
});

export const db = drizzle(client, { schema });
