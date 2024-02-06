import { pgTable, time, uuid, varchar } from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
	id: uuid("id").defaultRandom(),
	title: varchar("title", { length: 256 }),
	created_at: time("created_at", { withTimezone: false }).defaultNow(),
	updated_at: time("updated_at", { withTimezone: false }).defaultNow(),
});
