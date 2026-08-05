CREATE TYPE "public"."account_role" AS ENUM('user', 'admin');

ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "workspace_members" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "users"
  ALTER COLUMN "role" TYPE "public"."account_role"
  USING (
    CASE
      WHEN "role"::text IN ('owner', 'admin', 'operator') THEN 'admin'::"public"."account_role"
      ELSE 'user'::"public"."account_role"
    END
  );

ALTER TABLE "workspace_members"
  ALTER COLUMN "role" TYPE "public"."account_role"
  USING (
    CASE
      WHEN "role"::text IN ('owner', 'admin', 'operator') THEN 'admin'::"public"."account_role"
      ELSE 'user'::"public"."account_role"
    END
  );

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
ALTER TABLE "workspace_members" ALTER COLUMN "role" SET DEFAULT 'user';

DROP TYPE "public"."user_role";
ALTER TYPE "public"."account_role" RENAME TO "user_role";
