DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_source_check'
  ) THEN
    ALTER TABLE "orders"
      ADD CONSTRAINT "orders_source_check"
      CHECK ("source" IN ('website', 'telegram'));
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_currency_check'
  ) THEN
    ALTER TABLE "orders"
      ADD CONSTRAINT "orders_currency_check"
      CHECK ("currency" IN ('USD', 'EUR', 'RUB'));
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_value_cents_check'
  ) THEN
    ALTER TABLE "orders"
      ADD CONSTRAINT "orders_value_cents_check"
      CHECK ("value_cents" IS NULL OR "value_cents" >= 0);
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'conversations_source_check'
  ) THEN
    ALTER TABLE "conversations"
      ADD CONSTRAINT "conversations_source_check"
      CHECK ("source" IN ('website', 'telegram'));
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'conversations_unread_count_check'
  ) THEN
    ALTER TABLE "conversations"
      ADD CONSTRAINT "conversations_unread_count_check"
      CHECK ("unread_count" >= 0);
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_source_check'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_source_check"
      CHECK ("source" IN ('website', 'telegram'));
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_delivery_status_check'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_delivery_status_check"
      CHECK ("delivery_status" IN ('received', 'queued', 'sending', 'delivered', 'failed'));
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_delivery_attempts_check'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_delivery_attempts_check"
      CHECK ("delivery_attempts" >= 0);
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_delivery_lease_check'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_delivery_lease_check"
      CHECK (
        ("delivery_status" = 'sending' AND "delivery_lease_token" IS NOT NULL AND "delivery_lease_until" IS NOT NULL)
        OR
        ("delivery_status" <> 'sending' AND "delivery_lease_until" IS NULL)
      );
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'integration_events_source_check'
  ) THEN
    ALTER TABLE "integration_events"
      ADD CONSTRAINT "integration_events_source_check"
      CHECK ("source" IN ('website', 'telegram'));
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_workspace_requester_updated_idx"
  ON "orders" USING btree ("workspace_id", "requested_by_id", "updated_at" DESC)
  WHERE "requested_by_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "integration_events_outbox_idx"
  ON "integration_events" USING btree ("workspace_id", "received_at", "id")
  WHERE "source" = 'telegram'
    AND "event_type" = 'message.outbound.queued'
    AND "status" = 'received';
