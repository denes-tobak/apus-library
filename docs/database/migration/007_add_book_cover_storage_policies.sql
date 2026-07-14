drop policy if exists
  "Book covers: authenticated select"
  on storage.objects;

drop policy if exists
  "Book covers: authenticated insert"
  on storage.objects;

drop policy if exists
  "Book covers: authenticated update"
  on storage.objects;

drop policy if exists
  "Book covers: authenticated delete"
  on storage.objects;


create policy
  "Book covers: authenticated select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'book-covers'
);


create policy
  "Book covers: authenticated insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'book-covers'
);


create policy
  "Book covers: authenticated update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'book-covers'
)
with check (
  bucket_id = 'book-covers'
);


create policy
  "Book covers: authenticated delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'book-covers'
);