create policy "Authenticated users can read books"
on public.books
for select
to authenticated
using (true);

create policy "Authenticated users can add books"
on public.books
for insert
to authenticated
with check (true);

create policy "Authenticated users can update books"
on public.books
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete books"
on public.books
for delete
to authenticated
using (true);