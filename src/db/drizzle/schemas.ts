import { relations } from "drizzle-orm";
import {
	pgTable,
	serial,
	time,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
	id: uuid("id").defaultRandom(),
	title: varchar("title", { length: 256 }),
	created_at: time("created_at", { withTimezone: false }).defaultNow(),
	updated_at: time("updated_at", { withTimezone: false }).defaultNow(),
});

export const pollsRelations = relations(polls, ({ many }) => ({
	options: many(pollOptions),
}));

export const pollOptions = pgTable("poll_options", {
	id: uuid("id").defaultRandom(),
	poll_id: uuid("poll_id"),
	title: varchar("title", { length: 256 }),
});

export const pollOptionsRelations = relations(pollOptions, ({ one }) => ({
	poll: one(polls, {
		fields: [pollOptions.poll_id],
		references: [polls.id],
	}),
}));

export const votes = pgTable(
	"votes",
	{
		id: serial("id").primaryKey(),
		session_id: uuid("session_id").unique(),
		poll_id: uuid("poll_id").unique(),
		option_id: uuid("option_id"),
		created_at: time("created_at", { withTimezone: false }).defaultNow(),
	},
	(t) => ({
		sessionId_pollId_unique: uniqueIndex("sessionId_pollId_unique").on(
			t.session_id,
			t.poll_id,
		),
	}),
);

export const votesRelations = relations(votes, ({ one }) => ({
	poll: one(polls, {
		fields: [votes.poll_id],
		references: [polls.id],
	}),
	option: one(pollOptions, {
		fields: [votes.option_id],
		references: [pollOptions.id],
	}),
}));
