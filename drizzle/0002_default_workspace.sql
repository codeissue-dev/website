INSERT INTO "workspaces" ("name", "slug")
VALUES ('codeissue', 'codeissue')
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";
