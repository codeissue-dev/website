CREATE TYPE "public"."order_status" AS ENUM('SUBMITTED', 'REVIEWING', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'QUALITY_ASSURANCE', 'COMPLETED', 'CANCELED');
--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CUSTOMER', 'EXECUTOR', 'ADMIN');
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp with time zone,
	"image" text,
	"password_hash" text,
	"role" "user_role" DEFAULT 'CUSTOMER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_lowercase" CHECK ("email" = lower("email"))
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"assigned_executor_id" uuid,
	"title" text NOT NULL,
	"detailed_description" text NOT NULL,
	"problem_statement" text NOT NULL,
	"key_features" text NOT NULL,
	"technical_preferences" text,
	"reference_links" text,
	"desired_deadline" date,
	"status" "order_status" DEFAULT 'SUBMITTED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "orders_completed_at_matches_status" CHECK (("status" = 'COMPLETED') = ("completed_at" IS NOT NULL)),
	CONSTRAINT "orders_executor_is_not_customer" CHECK ("assigned_executor_id" IS NULL OR "assigned_executor_id" <> "customer_id")
);
--> statement-breakpoint
CREATE TABLE "order_status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"from_status" "order_status",
	"to_status" "order_status" NOT NULL,
	"changed_by_id" uuid NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_messages_body_length" CHECK (char_length("body") BETWEEN 1 AND 4000)
);
--> statement-breakpoint
CREATE TABLE "order_read_receipts" (
	"order_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"last_read_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_read_receipts_order_id_user_id_pk" PRIMARY KEY("order_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"tech_stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"industry" text,
	"project_url" text,
	"delivery_weeks" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_items_published_at_matches_published" CHECK ("published" = false OR "published_at" IS NOT NULL),
	CONSTRAINT "portfolio_items_delivery_weeks_positive" CHECK ("delivery_weeks" IS NULL OR "delivery_weeks" > 0)
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text,
	"company" text,
	"quote" text NOT NULL,
	"rating" integer,
	"order_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonials_published_at_matches_published" CHECK ("published" = false OR "published_at" IS NOT NULL),
	CONSTRAINT "testimonials_rating_range" CHECK ("rating" IS NULL OR "rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_assigned_executor_id_users_id_fk" FOREIGN KEY ("assigned_executor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "order_status_events" ADD CONSTRAINT "order_status_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "order_status_events" ADD CONSTRAINT "order_status_events_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "order_read_receipts" ADD CONSTRAINT "order_read_receipts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "order_read_receipts" ADD CONSTRAINT "order_read_receipts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE cascade;
--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "users_role_created_at_idx" ON "users" USING btree ("role","created_at");
--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "orders_reference_unique" ON "orders" USING btree ("reference");
--> statement-breakpoint
CREATE INDEX "orders_customer_id_created_at_idx" ON "orders" USING btree ("customer_id","created_at");
--> statement-breakpoint
CREATE INDEX "orders_assigned_executor_id_created_at_idx" ON "orders" USING btree ("assigned_executor_id","created_at");
--> statement-breakpoint
CREATE INDEX "orders_status_created_at_idx" ON "orders" USING btree ("status","created_at");
--> statement-breakpoint
CREATE INDEX "order_status_events_order_id_created_at_idx" ON "order_status_events" USING btree ("order_id","created_at");
--> statement-breakpoint
CREATE INDEX "order_messages_order_id_created_at_idx" ON "order_messages" USING btree ("order_id","created_at");
--> statement-breakpoint
CREATE INDEX "order_read_receipts_user_id_idx" ON "order_read_receipts" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_items_slug_unique" ON "portfolio_items" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX "portfolio_items_published_sort_order_idx" ON "portfolio_items" USING btree ("published","sort_order");
--> statement-breakpoint
CREATE INDEX "testimonials_published_sort_order_idx" ON "testimonials" USING btree ("published","sort_order");
