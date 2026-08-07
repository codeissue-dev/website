ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'website' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "external_order_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "requester_external_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "requester_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "requester_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint

ALTER TABLE "conversations" ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'website' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "source" text DEFAULT 'website' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "delivery_status" text DEFAULT 'delivered' NOT NULL;--> statement-breakpoint

DROP INDEX IF EXISTS "integration_events_source_external_unique";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "integration_events_workspace_source_external_unique"
  ON "integration_events" USING btree ("workspace_id", "source", "external_event_id")
  WHERE "external_event_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "orders_workspace_source_external_unique"
  ON "orders" USING btree ("workspace_id", "source", "external_order_id")
  WHERE "external_order_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_workspace_source_updated_idx"
  ON "orders" USING btree ("workspace_id", "source", "updated_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversations_workspace_source_last_message_idx"
  ON "conversations" USING btree ("workspace_id", "source", "last_message_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_delivery_status_idx"
  ON "messages" USING btree ("delivery_status", "sent_at");--> statement-breakpoint

UPDATE "orders" SET "source" = COALESCE(NULLIF("source", ''), 'website');--> statement-breakpoint
UPDATE "conversations" c
SET "source" = CASE
  WHEN i."provider" = 'telegram' THEN 'telegram'
  ELSE 'website'
END
FROM "integrations" i
WHERE c."integration_id" = i."id" AND c."source" = 'website';--> statement-breakpoint
UPDATE "messages" m
SET "source" = c."source"
FROM "conversations" c
WHERE m."conversation_id" = c."id" AND m."source" = 'website';--> statement-breakpoint
UPDATE "messages"
SET "delivery_status" = 'received'
WHERE "direction" = 'inbound' AND "delivery_status" = 'delivered';--> statement-breakpoint
UPDATE "integration_events"
SET "source" = CASE
  WHEN "source" = 'telegram' THEN 'telegram'
  ELSE 'website'
END
WHERE "source" NOT IN ('website', 'telegram');
