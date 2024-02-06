import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { envs } from "../../configs/env";

export const connection = postgres(envs.DATABASE_URL);
export const db = drizzle(connection);
