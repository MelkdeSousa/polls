import type { Config } from "drizzle-kit";
import { envs } from "./src/configs/env";

export default {
	schema: "./src/db/drizzle/schemas.ts",
	out: "./src/db/drizzle/migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: envs.DATABASE_URL,
	},
} satisfies Config;
