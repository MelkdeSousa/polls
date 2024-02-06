CREATE TABLE IF NOT EXISTS "polls" (
	"id" uuid DEFAULT gen_random_uuid(),
	"title" varchar(256),
	"created_at" time DEFAULT now(),
	"updated_at" time DEFAULT now()
);
