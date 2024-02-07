CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid,
	"poll_id" uuid,
	"option_id" uuid,
	"created_at" time DEFAULT now(),
	CONSTRAINT "votes_session_id_unique" UNIQUE("session_id"),
	CONSTRAINT "votes_poll_id_unique" UNIQUE("poll_id")
);
