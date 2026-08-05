INSERT INTO "workspaces" ("name", "slug")
VALUES ('Codeissue', 'codeissue')
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";
