# Manual reference import

Use the same Supabase project and database role (postgres) for every file.
Run each entire SQL file separately in the order below. Stop on an error.
The upload files store only the public reference SQL in an owner-only PostgreSQL
large object, not application tables. No new application schema or functions are
created. Only 99-publish.sql imports/activates reference data; it verifies the
complete upload hash, applies all original commands in one transaction, and
removes the temporary upload on success. Existing RLS is unchanged.

1. 00-initialize.sql
2. 01-upload.sql
3. 02-upload.sql
4. 03-upload.sql
5. 04-upload.sql
6. 05-upload.sql
7. 06-upload.sql
8. 07-upload.sql
9. 08-upload.sql
10. 09-upload.sql
11. 10-upload.sql
12. 99-publish.sql
