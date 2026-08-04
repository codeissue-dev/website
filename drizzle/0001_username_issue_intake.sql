ALTER TABLE "users" ADD COLUMN "username" text;--> statement-breakpoint
UPDATE "users"
SET "username" = 'user_' || substring(md5("id") from 1 for 12)
WHERE "username" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "requested_by_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "intake" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
