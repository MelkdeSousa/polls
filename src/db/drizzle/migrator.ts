import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connection, db } from "./connection";

await migrate(db, { migrationsFolder: __dirname + "/migrations" });
// Don't forget to close the connection, otherwise the script will hang
await connection.end();
