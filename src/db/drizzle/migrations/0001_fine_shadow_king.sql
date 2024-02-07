CREATE TABLE IF NOT EXISTS "poll_options" (
	"id" uuid DEFAULT gen_random_uuid(),
	"poll_id" uuid,
	"title" varchar(256)
);
