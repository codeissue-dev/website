ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "delivery_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "delivery_lease_token" uuid;--> statement-breakpoint
ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "delivery_lease_until" timestamptz;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_outbox_claim_idx"
  ON "messages" USING btree ("delivery_status", "delivery_lease_until", "sent_at")
  WHERE "delivery_status" IN ('queued', 'sending');
